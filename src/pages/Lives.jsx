import React, { useState, useEffect } from 'react';
import { Select, ConfigProvider, theme, Modal } from 'antd';
import { fetchClubs, fetchClubCameras } from '../controllers/serverController';
import { useLanguage } from '../contexts/LanguageContext';
import { useWebSocketStatus } from '../hooks/useWebSocketStatus';

const Lives = () => {
  const { t } = useLanguage();
  const [clubs, setClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStream, setSelectedStream] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Use WebSocket hook to get real-time updates
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
    const isClickable = isLive && camera.url && camera.url!="null";
    const embedUrl= camera.url?.replace("watch?v=", "embed/");
    
    return (
      <div 
        key={camera.ID} 
        className={`backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 overflow-hidden transition-all duration-200 ${
          isClickable ? 'cursor-pointer hover:bg-white/10 hover:scale-105' : ''
        }`}
        onClick={() => handleStreamClick(camera)}
      >
        <div className="aspect-video relative">
          {isLive && embedUrl && embedUrl!="null" ? (
            <iframe
              src={embedUrl}
              className="w-full h-full pointer-events-none"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-white/60 text-sm">{t('noLiveStreamingFound')}</p>
              </div>
            </div>
          )}
          
          {/* Live indicator */}
          {isLive && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              {t('lives').toUpperCase()}
            </div>
          )}

          {/* Click indicator for live streams */}
          {isClickable && (
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-white/20 rounded-full p-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-row justify-between">
          <h3 className="text-lg font-semibold text-white/90 mb-2">
            {t('court')} {camera.court_number}
          </h3>
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isLive 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {camera.status || t('offline')}
            </span>
          </div>
          
        </div>
        {isClickable && (
            <p className="text-white/40 text-xs px-4 pb-1">{t('clickToWatchFullScreen')}</p>
          )}
      </div>
    );
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        components: {
          Select: {
            colorBgContainer: "rgba(255,255,255,0.95)",
            colorText: "rgba(0,0,0,0.85)",
            colorTextPlaceholder: "rgba(0,0,0,0.6)",
            colorBorder: "rgba(255,255,255,0.2)",
            optionSelectedBg: "rgba(255,255,255,0.9)",
            optionActiveBg: "rgba(255,255,255,0.8)",
            colorBgElevated: "rgba(255,255,255,0.95)",
          },
          Modal: {
            contentBg: "rgba(15, 23, 42, 0.95)",
            headerBg: "rgba(15, 23, 42, 0.95)",
            colorText: "rgba(255, 255, 255, 0.9)",
            colorIcon: "rgba(255, 255, 255, 0.6)",
            colorIconHover: "rgba(255, 255, 255, 0.8)",
          },
        },
      }}
    >
      <div className="min-h-screen p-4 lg:p-8">
        <div className="max-w-7xl mx-auto" style={{ marginTop: '6rem' }}>
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-white/90 mb-4">
              {t('liveStreams')}
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              {t('liveStreamsDescription')}
            </p>
          </div>

          {/* Club Selection */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 mb-8">
            <div className="max-w-md mx-auto">
              <label className="block text-white/90 text-lg font-medium mb-4">
                {t('selectClubLive')}
              </label>
              <Select
                placeholder={t('chooseClubPlaceholder')}
                className="w-full"
                size="large"
                value={selectedClubId}
                onChange={setSelectedClubId}
                options={clubs.map(club => ({
                  value: club.ID,
                  label: club.Name
                }))}
              />
            </div>
          </div>

          {/* Live Streams Grid */}
          {selectedClubId && (
            <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-white/90 mb-6">
                {clubs.find(club => club.ID === selectedClubId)?.Name} - {t('liveCourts')}
              </h2>
              
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/60"></div>
                </div>
              ) : updatedCameras.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {updatedCameras.map(renderCameraCard)}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white/80 mb-2">{t('noCamerasFound')}</h3>
                  <p className="text-white/50">{t('noCamerasDescription')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full Screen Video Modal */}
      <Modal
        title={`${t('court')} ${selectedStream?.court_number} - ${t('liveStreamTitle')}`}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width="90vw"
        style={{ top: 20 }}
        styles={{
          body: { padding: 0 },
          content: { backgroundColor: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)' }
        }}
      >
        {selectedStream?.url && selectedStream.url!="null" && (
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