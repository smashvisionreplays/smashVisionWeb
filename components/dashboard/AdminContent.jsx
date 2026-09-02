import { useState, useEffect, useMemo } from "react";
import { Table, Modal, ConfigProvider, theme, Input, Select, Tooltip } from "antd";
import { useAuth } from "@clerk/clerk-react";
import { useLanguage } from "../../src/contexts/LanguageContext";
import { fetchOutdatedVideos, deleteVideosBatch } from "../../src/controllers/adminController";

// Small enough that a chunk finishes well inside the serverless proxy's
// timeout — Cloudflare has no bulk delete, so every video is its own request
// on the API side. The API caps this too; the smaller of the two wins.
const CHUNK_SIZE = 25;

const WEEKDAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Ant filter values must be primitives, and the "no weekday" bucket needs one
// that no real weekday can collide with.
const UNFORMATTED = "__unformatted__";

// Defined once and used both by the table's own filtering and by the derived
// set that "select all matching" acts on, so the two cannot disagree about
// which rows a filter means.
// Why a recording is still here. All three are equally deletable — the split
// exists to say which failure produced it, since they have different fixes.
const CATEGORY_LABELS = {
  orphan: "adminOrphan",
  deleteFailed: "adminDeleteFailed",
  stale: "adminStale",
};

const CATEGORY_HINTS = {
  orphan: "adminOrphanHint",
  deleteFailed: "adminDeleteFailedHint",
  stale: "adminStaleHint",
};

const CATEGORY_STYLES = {
  orphan: "bg-amber-500/10 text-amber-300/90 border-amber-400/20",
  deleteFailed: "bg-rose-500/10 text-rose-300/90 border-rose-400/20",
  stale: "bg-sky-500/10 text-sky-300/90 border-sky-400/20",
};

const FILTER_PREDICATES = {
  weekday: (value, record) => (value === UNFORMATTED ? !record.weekday : record.weekday === value),
  category: (value, record) => record.category === value,
};

const formatBytes = (bytes) => {
  if (!bytes) return "—";
  const gb = bytes / 1024 ** 3;
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  return `${(bytes / 1024 ** 2).toFixed(0)} MB`;
};

const formatDuration = (seconds) => {
  if (!seconds) return "—";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.round(seconds % 60)).padStart(2, "0")}`;
};

const ageInDays = (created) =>
  Math.floor((Date.now() - new Date(created).getTime()) / 86400000);

// Tooltips default to a flat near-black; `colorBgSpotlight` is the token that
// controls them, so they land in the same glass family as the modals.
const tooltipTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorBgSpotlight: "rgba(15, 20, 30, 0.96)",
    colorTextLightSolid: "rgba(255,255,255,0.85)",
    borderRadius: 12,
  },
};

const glassModal = {
  algorithm: theme.darkAlgorithm,
  token: { colorBgElevated: "rgba(15, 20, 30, 0.15)", colorBorder: "rgba(255,255,255,0.1)", borderRadiusLG: 20 },
};

const glassModalStyles = {
  mask: { backdropFilter: "blur(20px)", backgroundColor: "rgba(0,0,0,0.6)" },
  content: {
    background: "rgba(15, 20, 30, 0.55)",
    backdropFilter: "blur(40px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20,
    boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
    padding: 0,
  },
  header: { background: "transparent", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "20px 24px 16px", marginBottom: 0 },
  body: { padding: "20px 24px 24px" },
};

/**
 * Admin panel: what is still in Cloudflare past its 7-day life.
 *
 * When the weekly cleanup fails, or a club server uploads recordings the
 * platform never registered, the storage fills and new uploads start queueing
 * at the clubs. This is the manual way to clear that. Deletion is permanent
 * and Cloudflare-side, so it is confirmed by typing the word, batched with
 * visible progress, and reported per video rather than as one success.
 */
const AdminContent = ({ triggerNotification }) => {
  const { t, language } = useLanguage();
  const { getToken } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [days, setDays] = useState(7);
  const [selected, setSelected] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [progress, setProgress] = useState(null);
  const [filters, setFilters] = useState({ weekday: null, category: null });

  const confirmWord = language === "es" ? "eliminar" : "delete";
  const deleting = progress !== null;

  const load = async (windowDays = days) => {
    setLoading(true);
    setLoadError(false);
    try {
      const token = await getToken();
      const result = await fetchOutdatedVideos(windowDays, token);
      setData(result);
      setSelected([]);
    } catch (error) {
      console.error("Error loading outdated videos:", error);
      setData(null);
      setLoadError(true);
      triggerNotification?.("error", t("adminLoadError"), "", true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(days);
  }, [days]);

  const videos = useMemo(() => data?.videos ?? [], [data]);
  const selectedVideos = useMemo(
    () => videos.filter((video) => selected.includes(video.uid)),
    [videos, selected]
  );
  const selectedBytes = selectedVideos.reduce((total, video) => total + (video.sizeBytes ?? 0), 0);

  // The point of a day filter is to act on the whole match, which is more rows
  // than one page — so "select all" has to mean every matching row, not the
  // visible page. That needs the filtered set as data rather than as a render,
  // so the filters are controlled here and the rows derived from them: reading
  // the table's onChange instead would go stale the moment a delete or a reload
  // replaced the data without the user touching a filter.
  const visible = useMemo(
    () =>
      videos.filter((video) =>
        Object.entries(filters).every(
          ([key, values]) =>
            !values?.length || values.some((value) => FILTER_PREDICATES[key](value, video))
        )
      ),
    [videos, filters]
  );

  const visibleUIDs = useMemo(() => new Set(visible.map((video) => video.uid)), [visible]);
  const hiddenSelectedCount = selected.filter((uid) => !visibleUIDs.has(uid)).length;

  // Days present in the data, in week order, plus a bucket for the recordings
  // whose name the weekday could not be read from.
  const dayFilters = useMemo(() => {
    const present = new Set(videos.map((video) => video.weekday).filter(Boolean));
    const filters = WEEKDAY_ORDER.filter((day) => present.has(day)).map((day) => ({
      text: t(day) || day,
      value: day,
    }));
    if (videos.some((video) => !video.weekday)) {
      filters.push({ text: t("adminUnformatted"), value: UNFORMATTED });
    }
    return filters;
  }, [videos, t]);

  const handleConfirmDelete = async () => {
    if (confirmInput !== confirmWord) return;

    const uids = selectedVideos.map((video) => video.uid);
    const chunkSize = Math.min(CHUNK_SIZE, data?.maxDeleteBatch ?? CHUNK_SIZE);
    const totals = { deleted: 0, skipped: 0, failed: 0 };
    const cleared = new Set();

    setConfirmOpen(false);
    setConfirmInput("");
    setProgress({ done: 0, total: uids.length });

    try {
      for (let start = 0; start < uids.length; start += chunkSize) {
        const chunk = uids.slice(start, start + chunkSize);
        try {
          const result = await deleteVideosBatch(chunk, await getToken());
          totals.deleted += result.deleted.length;
          totals.skipped += result.skipped.length;
          totals.failed += result.failed.length;
          result.deleted.forEach((entry) => cleared.add(entry.uid));
        } catch (error) {
          // One chunk failing is not the whole run failing — keep going so a
          // single timeout doesn't strand the rest of the selection.
          console.error("Error deleting a batch of videos:", error);
          totals.failed += chunk.length;
        }
        setProgress({ done: Math.min(start + chunk.length, uids.length), total: uids.length });
      }
    } finally {
      setProgress(null);
    }

    // Drop what actually went, rather than refetching — Cloudflare's list is
    // eventually consistent and would happily show a deleted video again.
    setData((previous) =>
      previous && {
        ...previous,
        videos: previous.videos.filter((video) => !cleared.has(video.uid)),
      }
    );
    setSelected((previous) => previous.filter((uid) => !cleared.has(uid)));

    const summary = [
      `${totals.deleted} ${t("adminDeleted")}`,
      totals.skipped ? `${totals.skipped} ${t("adminSkipped")}` : null,
      totals.failed ? `${totals.failed} ${t("adminFailed")}` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    triggerNotification?.(
      totals.failed ? "error" : "success",
      totals.failed ? t("adminDeletePartial") : t("adminDeleteSuccess"),
      summary,
      Boolean(totals.failed)
    );
  };

  const columns = [
    {
      title: t("adminCreated"),
      dataIndex: "created",
      key: "created",
      render: (created) => (
        <div className="flex flex-col">
          <span className="text-white/80">{new Date(created).toLocaleDateString()}</span>
          <span className="text-white/35 text-xs">
            {t("adminDaysOld").replace("{days}", ageInDays(created))}
          </span>
        </div>
      ),
    },
    {
      title: t("adminDay"),
      dataIndex: "weekday",
      key: "weekday",
      filters: dayFilters,
      filteredValue: filters.weekday,
      filterMode: "tree",
      filterSearch: true,
      filterMultiple: true,
      onFilter: FILTER_PREDICATES.weekday,
      render: (weekday) =>
        weekday ? (
          <span className="text-white/80">{t(weekday) || weekday}</span>
        ) : (
          <span className="text-white/30 italic">{t("adminUnformatted")}</span>
        ),
    },
    {
      title: t("adminType"),
      dataIndex: "category",
      key: "category",
      filters: [
        { text: t("adminOrphan"), value: "orphan" },
        { text: t("adminDeleteFailed"), value: "deleteFailed" },
        { text: t("adminStale"), value: "stale" },
      ],
      filteredValue: filters.category,
      filterMultiple: true,
      onFilter: FILTER_PREDICATES.category,
      render: (category) => (
        // Not focusable, unlike the chips in the cards: these repeat the same
        // three explanations once per row, and 50 tab stops saying the same
        // thing is worse than none. The card chips are the keyboard path.
        <Tooltip
          title={t(CATEGORY_HINTS[category])}
          trigger={["hover", "click"]}
          overlayStyle={{ maxWidth: 260 }}
        >
          <span className={`px-2 py-0.5 rounded-lg text-xs font-medium border cursor-help ${CATEGORY_STYLES[category]}`}>
            {t(CATEGORY_LABELS[category])}
          </span>
        </Tooltip>
      ),
    },
    {
      title: t("adminSlot"),
      key: "slot",
      // The weekday has its own column now, so this carries what is left: the
      // slot for a recording the platform still indexes, the raw upload name
      // for one it never did.
      render: (_, record) =>
        record.category === "stale" ? (
          <span className="text-white/70 text-sm">
            {t("court")} {record.courtNumber} · {record.hour}:{record.hourSection === 0 ? "00" : "30"}
          </span>
        ) : (
          <span className="text-white/25 text-sm font-mono text-xs">{record.name || "—"}</span>
        ),
    },
    {
      title: t("adminDuration"),
      dataIndex: "durationSeconds",
      key: "durationSeconds",
      render: formatDuration,
    },
    {
      title: t("adminSize"),
      dataIndex: "sizeBytes",
      key: "sizeBytes",
      sorter: (a, b) => (a.sizeBytes ?? 0) - (b.sizeBytes ?? 0),
      render: formatBytes,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#acbb22]/20 border-t-[#B8E016]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Storage + what clearing this list would free */}
      <ConfigProvider theme={tooltipTheme}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <StatCard
            label={t("adminStorageUsed")}
            value={
              data?.storage
                ? `${Math.round(data.storage.totalStorageMinutes).toLocaleString()} ${t("adminMinutes")}`
                : "—"
            }
            detail={
              data?.storage?.totalStorageMinutesLimit
                ? `${t("adminOfLimit").replace(
                    "{limit}",
                    Math.round(data.storage.totalStorageMinutesLimit).toLocaleString()
                  )}`
                : null
            }
            meter={
              data?.storage?.totalStorageMinutesLimit
                ? data.storage.totalStorageMinutes / data.storage.totalStorageMinutesLimit
                : null
            }
          />
          <StatCard
            label={t("adminOutdatedCount")}
            value={(data?.summary.total ?? 0).toLocaleString()}
            // Broken out by cause: which number is large is the diagnosis, so
            // each carries the explanation of what it means.
            detail={
              data ? (
                <div className="flex flex-wrap gap-1.5">
                  <CategoryChip category="orphan" count={data.summary.orphan} t={t} />
                  <CategoryChip category="deleteFailed" count={data.summary.deleteFailed ?? 0} t={t} />
                  <CategoryChip category="stale" count={data.summary.stale} t={t} />
                </div>
              ) : null
            }
          />
          <StatCard
            label={t("adminReclaimable")}
            value={formatBytes(data?.summary.reclaimableBytes)}
            detail={
              data
                ? `${data.summary.reclaimableMinutes.toLocaleString()} ${t("adminMinutes")}`
                : null
            }
          />
        </div>
      </ConfigProvider>

      {data?.truncated && (
        <p className="text-amber-300/70 text-xs px-1">{t("adminTruncated")}</p>
      )}

      {/* Window picker + refresh */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-white/40 text-sm">{t("adminOlderThan")}</span>
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, token: { colorPrimary: "#acbb22" } }}>
          <Select
            value={days}
            onChange={setDays}
            disabled={deleting}
            style={{ width: 130 }}
            options={[
              { value: 7, label: `7 ${t("adminDays")}` },
              { value: 14, label: `14 ${t("adminDays")}` },
              { value: 30, label: `30 ${t("adminDays")}` },
              { value: 90, label: `90 ${t("adminDays")}` },
            ]}
          />
        </ConfigProvider>
        <button
          onClick={() => load(days)}
          disabled={deleting}
          className="px-3 py-1.5 rounded-xl text-sm font-medium bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 transition-all duration-200 disabled:opacity-30"
        >
          {t("adminRefresh")}
        </button>
      </div>

      <p className="text-white/30 text-xs leading-relaxed px-1">{t("adminExplainer")}</p>

      {/* Deletion progress */}
      {deleting && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">
              {t("adminDeletingProgress")
                .replace("{done}", progress.done)
                .replace("{total}", progress.total)}
            </span>
            <span className="text-white/40">
              {Math.round((progress.done / progress.total) * 100)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#acbb22] to-[#B8E016] transition-all duration-300"
              style={{ width: `${(progress.done / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Selection action bar */}
      {selected.length > 0 && !deleting && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-400/20 bg-red-500/[0.07] px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-white/70 text-sm">
              {t("adminSelectedCount").replace("{count}", selected.length)} · {formatBytes(selectedBytes)}
            </span>
            {/* Selection survives a filter change, so say so — otherwise the
                count reads as if it were only what is on screen. */}
            {hiddenSelectedCount > 0 && (
              <span className="text-amber-300/70 text-xs">
                {t("adminSelectedHidden").replace("{count}", hiddenSelectedCount)}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setConfirmInput("");
              setConfirmOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500/80 text-white hover:bg-red-500 transition-all duration-200"
          >
            {t("adminDeleteSelected")}
          </button>
        </div>
      )}

      {loadError ? (
        <EmptyPanel title={t("adminLoadError")} body={t("adminLoadErrorHint")} />
      ) : videos.length === 0 ? (
        <EmptyPanel title={t("adminNoneTitle")} body={t("adminNoneBody")} />
      ) : (
        <div className="relative backdrop-blur-sm bg-white/2 rounded-2xl border border-white/10 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#acbb22]/30 to-transparent pointer-events-none z-10"></div>
          <ConfigProvider
            theme={{
              algorithm: theme.darkAlgorithm,
              token: {
                colorPrimary: "#acbb22",
                colorBgElevated: "rgba(8, 10, 16, 0.96)",
                colorBorder: "rgba(255,255,255,0.1)",
                borderRadius: 12,
                borderRadiusLG: 16,
                // Matches the chips in the cards above — the Reason badges
                // carry the same hints and should look the same doing it.
                colorBgSpotlight: "rgba(15, 20, 30, 0.96)",
                colorTextLightSolid: "rgba(255,255,255,0.85)",
              },
              components: {
                Table: {
                  bodySortBg: "rgba(0,0,0,0)",
                  headerBg: "rgba(0,0,0,0)",
                  colorBgContainer: "rgba(255,255,255,0)",
                },
              },
            }}
          >
            <Table
              className="px-2"
              rowKey="uid"
              columns={columns}
              dataSource={videos}
              pagination={{ pageSize: 50, showSizeChanger: false }}
              onChange={(_pagination, nextFilters) =>
                setFilters({
                  weekday: nextFilters.weekday ?? null,
                  category: nextFilters.category ?? null,
                })
              }
              rowSelection={{
                selectedRowKeys: selected,
                onChange: setSelected,
                getCheckboxProps: () => ({ disabled: deleting }),
                // Ant's header checkbox only reaches the current page. Filtering
                // to a weekday and clearing all of it is the whole point here,
                // so add the actions that span every page of the match.
                selections: [
                  {
                    key: "all-filtered",
                    text: t("adminSelectAllFiltered").replace("{count}", visible.length),
                    onSelect: () => setSelected(visible.map((video) => video.uid)),
                  },
                  {
                    key: "none",
                    text: t("adminClearSelection"),
                    onSelect: () => setSelected([]),
                  },
                ],
              }}
            />
          </ConfigProvider>
        </div>
      )}

      {/* Confirmation — permanent and Cloudflare-side, so it asks for the word */}
      <ConfigProvider theme={glassModal} modal={{ styles: glassModalStyles }}>
        <Modal
          title={
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-red-500 to-red-400 flex-shrink-0"></div>
              <span className="text-white/90 font-semibold text-base">{t("adminConfirmTitle")}</span>
            </div>
          }
          open={confirmOpen}
          onCancel={() => setConfirmOpen(false)}
          footer={null}
          width={460}
          closeIcon={
            <span className="text-white/40 hover:text-white/80 transition-colors text-lg leading-none">✕</span>
          }
        >
          <div className="flex flex-col gap-4">
            <p className="text-white/70 text-sm leading-relaxed">
              {t("adminConfirmBody")
                .replace("{count}", selected.length)
                .replace("{size}", formatBytes(selectedBytes))}
            </p>
            <p className="text-white/40 text-xs leading-relaxed">{t("adminConfirmWarning")}</p>
            <div className="flex flex-col gap-2">
              <label className="text-white/60 text-xs">{t("deleteClipConfirmLabel")}</label>
              <Input
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder={t("deleteClipConfirmPlaceholder")}
                onPressEnter={confirmInput === confirmWord ? handleConfirmDelete : undefined}
                style={{ background: "rgba(255,255,255,0.05)", color: "white", borderColor: "rgba(255,255,255,0.12)" }}
                autoFocus
              />
            </div>
            <button
              onClick={handleConfirmDelete}
              disabled={confirmInput !== confirmWord}
              className="w-full py-2.5 rounded-xl text-sm font-semibold bg-red-500/80 text-white hover:bg-red-500 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t("adminDeleteSelected")}
            </button>
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
};

const StatCard = ({ label, value, detail, meter }) => (
  <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-4 overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#acbb22]/30 to-transparent pointer-events-none"></div>
    <p className="text-white/35 text-xs font-medium tracking-wide uppercase">{label}</p>
    <p className="text-white/90 text-xl font-bold mt-1">{value}</p>
    {/* A div, not a p: `detail` may be a row of chips rather than a string. */}
    {detail && <div className="text-white/35 text-xs mt-1.5">{detail}</div>}
    {meter != null && (
      <div className="h-1 rounded-full bg-white/10 overflow-hidden mt-3">
        <div
          className={`h-full transition-all duration-300 ${
            meter > 0.9 ? "bg-red-500/80" : meter > 0.75 ? "bg-amber-400/80" : "bg-gradient-to-r from-[#acbb22] to-[#B8E016]"
          }`}
          style={{ width: `${Math.min(100, meter * 100)}%` }}
        />
      </div>
    )}
  </div>
);

/**
 * A count for one category, with its explanation a hover or a tap away.
 *
 * Styled as a chip but deliberately inert — the reason for a recording is not
 * a control, and making these filter the table would be a second, competing
 * way to do what the Reason column already does. `cursor-help` rather than
 * `cursor-pointer` says as much.
 *
 * Triggered on click as well as hover so it is reachable on touch, where the
 * table's own hover hints are not, and focusable so it is reachable by keyboard.
 */
const CategoryChip = ({ category, count, t }) => (
  <Tooltip
    title={t(CATEGORY_HINTS[category])}
    trigger={["hover", "click", "focus"]}
    placement="bottom"
    overlayStyle={{ maxWidth: 260 }}
  >
    <span
      tabIndex={0}
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs cursor-help select-none
                  transition-colors duration-200 hover:brightness-125 focus:outline-none
                  focus:ring-1 focus:ring-white/20 ${CATEGORY_STYLES[category]}`}
    >
      <span className="font-semibold tabular-nums">{count}</span>
      <span className="font-medium">{t(CATEGORY_LABELS[category])}</span>
      <svg className="w-3 h-3 opacity-50 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M12 11v5" />
        <circle cx="12" cy="7.75" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    </span>
  </Tooltip>
);

const EmptyPanel = ({ title, body }) => (
  <div className="flex flex-col items-center justify-center h-64">
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 flex items-center justify-center mb-4 shadow-inner">
      <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h3 className="text-sm font-semibold text-white/40 mb-1">{title}</h3>
    <p className="text-white/25 text-xs text-center max-w-xs leading-relaxed">{body}</p>
  </div>
);

export default AdminContent;
