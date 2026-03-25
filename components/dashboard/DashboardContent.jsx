import TableAnt from "../TableAnt";
import { fetchClubVideos, fetchClubClips, fetchMemberClips, fetchClubCameras, fetchBlockVideo, fetchUnblockVideo, toggleCameraLive } from '../../src/controllers/serverController';
import { useState, useEffect } from "react";
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useWebSocket } from '../../src/contexts/WebSocketContext';
import { Modal, ConfigProvider, theme } from 'antd';
import '../../stylesheet/dashboard.css';
import { clipsColumns, livesColumns, videosColumns } from "./columnSchemas";
import StatisticsContent from "./StatisticsContent";

const DashboardContent = ({ selectedButton, userRole, userId, renderModal, triggerNotification }) => {
  const { t } = useLanguage();
  const { liveUpdates } = useWebSocket();
  const [videos, setVideos] = useState([]);
  const [clips, setClips] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingCameras, setTogglingCameras] = useState(new Set());
  const [watchCamera, setWatchCamera] = useState(null);

  const handleShowModal = (videoUID) => {
    renderModal(videoUID);
  };

  const handleBlockVideo = async (videoId) => {
    const response = await fetchBlockVideo(videoId);
    // console.log("response fetch block video", response);
    loadVideos();
  };

  const handleUnblockVideo = async (videoId) => {
    const response = await fetchUnblockVideo(videoId);
    // console.log("response fetch unblock video", response);
    loadVideos();
  };

  const handleToggleLive = async (cameraId, courtNumber, currentStatus) => {
    const newStatus = currentStatus === 'Live' ? 'Off' : 'Live';
    setTogglingCameras(prev => new Set([...prev, cameraId]));
    try {
      await toggleCameraLive(cameraId, userId, courtNumber, newStatus);
      loadCameras();
    } catch (error) {
      console.error('Error toggling live:', error);
      triggerNotification?.('error', t('streamStartFailed'), error.message || 'Failed to toggle live status', true);
    } finally {
      setTogglingCameras(prev => {
        const newSet = new Set(prev);
        newSet.delete(cameraId);
        return newSet;
      });
    }
  };

  // Load clips based on user role and ID
  useEffect(() => {
    const loadClips = async () => {
      setLoading(true);
      try {
        let clubData;
        if (userRole === 'club') {
          // Club sees their own clips
          clubData = await fetchClubClips(userId);
        } else {
          // Member sees clips from their associated club (you may need to adjust this logic)
          clubData = await fetchMemberClips(userId); // or fetch member-specific clips
        }
        
        if (clubData) {
          const formattedClips = clubData.map((clip) => ({
            ID: clip.id,
            Weekday: clip.weekday,
            date: clip.clip_name.split(" - ")[1],
            Clip_Name: clip.clip_name,
            tag: clip.tag,
            id_club: clip.id_club,
            UID: clip.uid,
            URL: clip.url || null,
            downloadURL: clip.downloadurl || null,
          }));
          // // console.log("formattedClips", formattedClips);
          setClips(formattedClips);
        }
      } catch (error) {
        console.error("Error loading clips:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      loadClips();
    }
  }, [userId, userRole]);

  const loadCameras = async () => {
    try {
      const clubData = await fetchClubCameras(userId);
      if (clubData) {
        const formattedCameras = clubData.map((camera) => ({
          ID: camera.id,
          court_number: camera.court_number,
          status: camera.livestatus,
          live_tunnel_url: camera.live_tunnel_url || null,
        }));
        setCameras(formattedCameras);
      }
    } catch (error) {
      console.error("Error loading cameras:", error);
    }
  };

  useEffect(() => {
    if (userRole === 'club' && userId) {
      loadCameras();
    }
  }, [userId, userRole]);

  // Reload cameras when WebSocket reload signal is received
  useEffect(() => {
    if (liveUpdates._reloadTrigger && userRole === 'club' && userId) {
      loadCameras();
    }
  }, [liveUpdates._reloadTrigger, userRole, userId]);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const clubData = await fetchClubVideos(userId);
      if (clubData) {
        const formattedVideos = clubData.map((video) => ({
          ID: video.id,
          id_club: userId,
          Weekday: video.weekday,
          Court_Number: video.court_number,
          originalHour: video.hour,
          Hour: `${video.hour}:${video.hour_section == 0 ? '00' : '30'}`,
          Hour_Section: video.hour_section,
          URL: video.url || null,
          Blocked: video.blocked,
          videoStatus: video.url ? "Sí" : "No",
          UID: video.uid,
        }));
        setVideos(formattedVideos);
      }
    } catch (error) {
      console.error("Error loading videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === 'club' && userId) {
      loadVideos();
    }
  }, [userId, userRole]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#acbb22]/20 border-t-[#B8E016]"></div>
        </div>
      );
    }

    // Member role can only see clips
    if (userRole === 'member' && selectedButton !== 'Clips') {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-white/50 mb-1">Access Restricted</h3>
          <p className="text-white/30 text-sm text-center max-w-xs leading-relaxed">
            This section is only available for club accounts.
          </p>
        </div>
      );
    }

    switch (selectedButton) {
      case "Clips":
        return clips.length > 0 ? (
          <div className="relative backdrop-blur-sm bg-white/2 rounded-2xl border border-white/10 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#acbb22]/30 to-transparent pointer-events-none z-10"></div>
            <TableAnt
              columns={clipsColumns(clips, handleShowModal, t)}
              data={clips}
              needsExpand={false}
              needsVirtual={true}
            />
          </div>
        ) : (
          <EmptyState type="clips" />
        );

      case "Videos":
        return videos.length > 0 ? (
          <div className="relative backdrop-blur-sm bg-white/2 rounded-2xl border border-white/10 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#acbb22]/30 to-transparent pointer-events-none z-10"></div>
            <TableAnt
              columns={videosColumns(videos, handleShowModal, handleBlockVideo, handleUnblockVideo, t)}
              data={videos}
              needsExpand={false}
              needsVirtual={true}
            />
          </div>
        ) : (
          <EmptyState type="videos" />
        );

      case "Lives":
        return (
          <div className="space-y-4">
            {cameras.length > 0 ? (
              <>
                <div className="relative sm:hidden backdrop-blur-sm bg-white/2 rounded-2xl border border-white/10 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#acbb22]/30 to-transparent pointer-events-none z-10"></div>
                  <TableAnt
                    columns={livesColumns(cameras, handleToggleLive, setWatchCamera, togglingCameras, t)}
                    data={cameras}
                    needsExpand={true}
                    needsVirtual={true}
                  />
                </div>
                <div className="relative hidden lg:block backdrop-blur-sm bg-white/2 rounded-2xl border border-white/10 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#acbb22]/30 to-transparent pointer-events-none z-10"></div>
                  <TableAnt
                    columns={livesColumns(cameras, handleToggleLive, setWatchCamera, togglingCameras, t)}
                    data={cameras}
                    needsExpand={false}
                    needsVirtual={false}
                  />
                </div>
              </>
            ) : (
              <EmptyState type="cameras" />
            )}

            {/* Watch Live Modal */}
            <ConfigProvider
              theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                  colorBgElevated: 'rgba(15, 20, 30, 0.15)',
                  colorBorder: 'rgba(255,255,255,0.1)',
                  borderRadiusLG: 20,
                },
              }}
              modal={{
                styles: {
                  mask: { backdropFilter: 'blur(20px)', backgroundColor: 'rgba(0, 0, 0, 0.55)' },
                  content: {
                    background: 'rgba(15, 20, 30, 0.35)',
                    backdropFilter: 'blur(40px) saturate(200%) brightness(1.1)',
                    WebkitBackdropFilter: 'blur(40px) saturate(200%) brightness(1.1)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: 24,
                    boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06) inset, 0 1px 0 rgba(255,255,255,0.08) inset',
                    padding: 0,
                    overflow: 'hidden',
                  },
                  header: { background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '20px 24px 16px', marginBottom: 0 },
                  body: { padding: 0 },
                },
              }}
            >
              <Modal
                title={
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#acbb22] to-[#B8E016] shadow-[0_0_8px_rgba(172,187,34,0.4)] flex-shrink-0"></div>
                    <span className="text-white/90 font-semibold text-base">
                      {t('court')} {watchCamera?.court_number} — Live
                    </span>
                  </div>
                }
                open={!!watchCamera}
                onCancel={() => setWatchCamera(null)}
                footer={null}
                width={{ xs: '90%', sm: '80%', md: '70%', lg: '60%', xl: '50%', xxl: '40%' }}
                closeIcon={<span className="text-white/40 hover:text-white/80 transition-colors duration-200 text-lg leading-none">✕</span>}
                styles={{ body: { padding: 0 } }}
              >
                {watchCamera?.live_tunnel_url && (
                  <div style={{ aspectRatio: '16/9', width: '100%' }}>
                    <iframe
                      src={`${watchCamera.live_tunnel_url}/stream.html?src=court${watchCamera.court_number}`}
                      style={{ display: 'block', width: '100%', height: '100%', border: 'none' }}
                      allowFullScreen
                    />
                  </div>
                )}
              </Modal>
            </ConfigProvider>
          </div>
        );

      case "Statistics":
        return <StatisticsContent userId={userId} />;

      default:
        return <EmptyState type="data" />;
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
};

// Empty State Component
const EmptyState = ({ type }) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 flex items-center justify-center mb-4 shadow-inner">
        <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-white/40 mb-1">{t('noTypeAvailable').replace('{type}', type)}</h3>
      <p className="text-white/25 text-xs text-center max-w-xs leading-relaxed">
        {t('noTypeCurrently').replace('{type}', type)}
      </p>
    </div>
  );
};

export default DashboardContent;