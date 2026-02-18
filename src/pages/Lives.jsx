import React, { useState, useEffect } from 'react';
import { Select, ConfigProvider, theme, Modal } from 'antd';
import { fetchClubs, fetchClubCameras } from '../controllers/serverController';
import { useLanguage } from '../contexts/LanguageContext';
import { useWebSocketStatus } from '../hooks/useWebSocketStatus';
import '../../stylesheet/lives.css';

const Lives = () => {
  const { t } = useLanguage();
  const [clubs, setClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStream, setSelectedStream] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updatedCameras = useWebSocketStatus(cameras);

  useEffect(() => {
    loadClubs();
  }, []);

  useEffect(() => {
    if (selectedClubId) {
      loadCameras();
    }
  }, [selectedClubId]);

  const loadClubs = async () => {
    try {
      const clubsData = await fetchClubs();
      const filteredClubs = clubsData.filter(club => club.status === "active");
      setClubs(filteredClubs);
    } catch (error) {
      console.error('Error loading clubs:', error);
    }
  };

  const loadCameras = async () => {
    setLoading(true);
    try {
      const camerasData = await fetchClubCameras(selectedClubId);
      if (camerasData) {
        const formattedCameras = camerasData.map((camera) => ({
          ID: camera.ID,
          court_number: camera.Court_Number,
          status: camera.liveStatus,
          url: camera.liveUrl || null,
          notes: camera.liveNotes || null,
          ip: camera.IP || null,
          endpoint: camera.serverEndpoint || null,
        }));
        setCameras(formattedCameras);
      }
    } catch (error) {
      console.error('Error loading cameras:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStreamClick = (camera) => {
    if (camera.status === 'Live' && camera.url) {
      setSelectedStream(camera);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStream(null);
  };

  const renderCameraCard = (camera) => {
    const isLive = camera.status === 'Live';
    const isClickable = isLive && camera.url && camera.url !== "null";
    const embedUrl = camera.url?.replace("watch?v=", "embed/");

    return (
      <div
        key={camera.ID}
        className={`relative backdrop-blur-xl bg-white/[0.03] rounded-3xl border border-white/10 shadow-xl overflow-hidden transition-all duration-300 ${
          isClickable ? 'cursor-pointer hover:border-white/20 hover:shadow-2xl hover:scale-[1.02]' : ''
        }`}
        onClick={() => handleStreamClick(camera)}
      >
        {/* Top shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#acbb22]/30 to-transparent pointer-events-none z-10"></div>

        {/* Video area */}
        <div className="aspect-video relative">
          {isLive && embedUrl && embedUrl !== "null" ? (
            <iframe
              src={embedUrl}
              className="w-full h-full pointer-events-none"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-white/[0.02] to-transparent flex items-center justify-center">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-white/30 text-xs font-medium">{t('noLiveStreamingFound')}</p>
              </div>
            </div>
          )}

          {/* LIVE badge */}
          {isLive && (
            <div className="absolute top-3 left-3 backdrop-blur-sm bg-red-500/20 border border-red-500/30 text-red-400 px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 z-10">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span>
              {t('lives').toUpperCase()}
            </div>
          )}

          {/* Hover play overlay */}
          {isClickable && (
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Card footer */}
        <div className="px-4 py-3 border-t border-white/[0.06] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white/80">
            {t('court')} {camera.court_number}
          </h3>
          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${
            isLive
              ? 'bg-[#acbb22]/10 text-[#B8E016] border border-[#acbb22]/20'
              : 'bg-white/5 text-white/35 border border-white/10'
          }`}>
            {camera.status || t('offline')}
          </span>
        </div>

        {isClickable && (
          <p className="text-white/25 text-xs px-4 pb-3 -mt-1">{t('clickToWatchFullScreen')}</p>
        )}
      </div>
    );
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#acbb22',
          colorBgElevated: 'rgba(15, 20, 30, 0.85)',
          colorBorder: 'rgba(255,255,255,0.1)',
          borderRadius: 12,
          borderRadiusLG: 16,
        },
        components: {
          Select: {
            colorBgContainer: 'rgba(255,255,255,0.05)',
            colorBgElevated: 'rgba(15, 20, 30, 0.85)',
            colorText: 'rgba(255,255,255,0.85)',
            colorTextPlaceholder: 'rgba(255,255,255,0.3)',
            colorBorder: 'rgba(255,255,255,0.1)',
            optionSelectedBg: 'rgba(172,187,34,0.12)',
            optionActiveBg: 'rgba(255,255,255,0.05)',
            selectorBg: 'rgba(255,255,255,0.05)',
          },
        },
      }}
    >
      <div className="min-h-screen p-4 lg:p-8" style={{ marginTop: '6rem' }}>
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold mb-4">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span>
              LIVE
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white/90 mb-3">
              {t('liveStreams')}
            </h1>
            <p className="text-white/45 max-w-xl mx-auto text-base">
              {t('liveStreamsDescription')}
            </p>
          </div>

          {/* Club Selection */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#acbb22] to-[#B8E016] shadow-[0_0_8px_rgba(172,187,34,0.4)] flex-shrink-0"></div>
              <label className="text-[#B8E016] text-sm font-semibold">
                {t('selectClubLive')}
              </label>
            </div>
            <Select
              placeholder={t('chooseClubPlaceholder')}
              size="large"
              value={selectedClubId}
              onChange={setSelectedClubId}
              options={clubs.map(club => ({
                value: club.ID,
                label: club.Name
              }))}
              style={{ width: 300 }}
            />
          </div>

          {/* No club selected state */}
          {!selectedClubId && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-white/35 text-sm">{t('selectClubToSeeLives')}</p>
            </div>
          )}

          {/* Camera Grid */}
          {selectedClubId && (
            loading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="relative w-12 h-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#acbb22]/20 border-t-[#B8E016]"></div>
                </div>
                <p className="text-white/30 text-sm font-medium tracking-wide">{t('loading')}</p>
              </div>
            ) : updatedCameras.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {updatedCameras.map(renderCameraCard)}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white/60 mb-1">{t('noCamerasFound')}</h3>
                <p className="text-white/30 text-sm">{t('noCamerasDescription')}</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Full Screen Video Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#acbb22] to-[#B8E016] shadow-[0_0_8px_rgba(172,187,34,0.4)] flex-shrink-0"></div>
            <span className="text-white/90 font-semibold text-base">
              {t('court')} {selectedStream?.court_number} — {t('liveStreamTitle')}
            </span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width="90vw"
        style={{ top: 20 }}
        closeIcon={
          <span className="text-white/40 hover:text-white/80 transition-colors duration-200 text-lg leading-none">✕</span>
        }
        styles={{
          mask: {
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(0,0,0,0.6)',
          },
          content: {
            background: 'rgba(15, 20, 30, 0.35)',
            backdropFilter: 'blur(40px) saturate(200%) brightness(1.1)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%) brightness(1.1)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 24,
            boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06) inset, 0 1px 0 rgba(255,255,255,0.08) inset',
            padding: 0,
            overflow: 'hidden',
          },
          header: {
            background: 'transparent',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            padding: '20px 24px 16px',
            marginBottom: 0,
          },
          body: { padding: 0 },
        }}
      >
        {selectedStream?.url && selectedStream.url !== "null" && (
          <div className="aspect-video">
            <iframe
              src={selectedStream?.url?.replace("watch?v=", "embed/")}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </Modal>
    </ConfigProvider>
  );
};

export default Lives;
