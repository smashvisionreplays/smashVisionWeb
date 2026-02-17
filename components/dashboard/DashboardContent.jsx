import TableAnt from "../TableAnt";
import { fetchClubVideos, fetchClubClips, fetchMemberClips, fetchClubCameras, fetchStartStream, fetchBlockVideo, fetchUnblockVideo, createYoutubeLive, fetchClubById, fetchStopStream, checkYouTubeStatus, disconnectYouTube } from '../../src/controllers/serverController';
import { useState, useEffect } from "react";
import { useAuth } from '@clerk/clerk-react';
import { useLanguage } from '../../src/contexts/LanguageContext';
import { useWebSocket } from '../../src/contexts/WebSocketContext';
import { useWebSocketStatus } from '../../src/hooks/useWebSocketStatus';
import '../../stylesheet/dashboard.css';
import { clipsColumns, livesColumns, videosColumns } from "./columnSchemas";
import StatisticsContent from "./StatisticsContent";

const DashboardContent = ({ selectedButton, userRole, userId, renderModal, triggerNotification }) => {
  const { getToken } = useAuth();
  const { t } = useLanguage();
  const { liveUpdates } = useWebSocket();
  const [videos, setVideos] = useState([]);
  const [clips, setClips] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [rtmpKeys, setRtmpKeys] = useState({});
  const [loading, setLoading] = useState(true);
  const [clubData, setClubData] = useState(null);
  const [connectingCameras, setConnectingCameras] = useState(new Set());
  const [youtubeStatus, setYoutubeStatus] = useState({ connected: false, authUrl: null });

  const handleInputChange = (court_number, value) => {
    setRtmpKeys((prev) => ({ ...prev, [court_number]: value }));
  };

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

  const handleStartLive = async (cameraId, court, cameraIp, rtmpKey, clubEndpoint) => {
    // console.log("handle start live", cameraId, court, cameraIp, rtmpKey, clubEndpoint);
    
    setConnectingCameras(prev => new Set([...prev, cameraId]));
    
    try {
      const authToken = await getToken();
      const clubName = clubData?.Name || 'Club';
      const youtubeResponse = await createYoutubeLive(clubName, court, authToken);
      
      if (youtubeResponse?.success) {
        const autoRtmpKey = youtubeResponse.data.rtmpKey;
        const watchUrl = youtubeResponse.data.watchUrl;
        // console.log('YouTube live created:', youtubeResponse.data);
        
        const response = await fetchStartStream(userId, cameraId, cameraIp, court, autoRtmpKey, clubEndpoint, watchUrl);
        // console.log("response fetch start stream", response);
        loadCameras();
      } else if (youtubeResponse?.needsAuth) {
        // console.log('Opening YouTube OAuth...');
        const popup = window.open(youtubeResponse.authUrl, 'youtube-auth', 'width=500,height=600');
        
        // Listen for auth completion
        const messageListener = (event) => {
          if (event.data === 'youtube-auth-complete') {
            window.removeEventListener('message', messageListener);
            popup.close();
            // Retry after auth
            handleStartLive(cameraId, court, cameraIp, rtmpKey, clubEndpoint);
          }
        };
        window.addEventListener('message', messageListener);
      } else {
        console.error('Failed to create YouTube live:', youtubeResponse?.error);
        const errorMessage = youtubeResponse?.error?.error?.message || youtubeResponse?.error || 'Failed to create YouTube live stream';
        triggerNotification?.('error', 'YouTube Live Creation Failed', errorMessage, true);
      }
    } catch (error) {
      console.error('Error in handleStartLive:', error);
      if (error.isClubServerDown) {
        triggerNotification?.('error', t('clubServerUnavailable'), error.message, true);
      } else {
        triggerNotification?.('error', t('streamStartFailed'), error.message || 'An unexpected error occurred while starting the stream', true);
      }
    } finally {
      setConnectingCameras(prev => {
        const newSet = new Set(prev);
        newSet.delete(cameraId);
        return newSet;
      });
    }
  };

  const handleStopLive = async (cameraId, cameraIp, clubEndpoint) => {
    // console.log("handle stop live", cameraId, cameraIp, clubEndpoint);
    
    setConnectingCameras(prev => new Set([...prev, cameraId]));
    
    try {
      const response = await fetchStopStream(userId, cameraId, cameraIp, clubEndpoint);
      // console.log("response fetch stop stream", response);
      loadCameras();
    } catch (error) {
      console.error('Error in handleStopLive:', error);
      if (error.isClubServerDown) {
        triggerNotification?.('error', t('clubServerUnavailable'), error.message, true);
      } else {
        triggerNotification?.('error', t('streamStopFailed'), error.message || 'An unexpected error occurred while stopping the stream', true);
      }
    } finally {
      setConnectingCameras(prev => {
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
            ID: clip.ID,
            Weekday: clip.Weekday,
            date: clip.Clip_Name.split(" - ")[1],
            Clip_Name: clip.Clip_Name,
            tag: clip.Tag,
            id_club: clip.id_club,
            UID: clip.UID,
            URL: clip.URL || null,
            downloadURL: clip.downloadURL || null,
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
          ID: camera.ID,
          court_number: camera.Court_Number,
          status: camera.liveStatus,
          url: camera.liveUrl || null,
          notes: camera.liveNotes || null,
          ip: camera.IP || null,
          endpoint: camera.serverEndpoint || null
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
      loadClubData();
      loadYouTubeStatus();
    }
  }, [userId, userRole]);

  // Reload cameras when WebSocket reload signal is received
  useEffect(() => {
    if (liveUpdates._reloadTrigger && userRole === 'club' && userId) {
      // console.log('Reloading cameras due to WebSocket signal');
      loadCameras();
    }
  }, [liveUpdates._reloadTrigger, userRole, userId]);



  // Listen for YouTube auth completion
  useEffect(() => {
    const messageListener = (event) => {
      if (event.data === 'youtube-auth-complete') {
        loadYouTubeStatus(); // Refresh YouTube status
      }
    };
    window.addEventListener('message', messageListener);
    return () => window.removeEventListener('message', messageListener);
  }, []);

  const loadYouTubeStatus = async () => {
    try {
      const authToken = await getToken();
      const status = await checkYouTubeStatus(authToken);
      if (status) {
        setYoutubeStatus(status);
      }
    } catch (error) {
      console.error('Error loading YouTube status:', error);
    }
  };

  const handleDisconnectYouTube = async () => {
    try {
      const authToken = await getToken();
      const result = await disconnectYouTube(authToken);
      if (result?.success) {
        setYoutubeStatus({ connected: false, authUrl: null });
        loadYouTubeStatus(); // Refresh status
      }
    } catch (error) {
      console.error('Error disconnecting YouTube:', error);
    }
  };

  const loadClubData = async () => {
    try {
      const data = await fetchClubById(userId);
      setClubData(data);
    } catch (error) {
      console.error('Error loading club data:', error);
    }
  };

  const loadVideos = async () => {
    setLoading(true);
    try {
      const clubData = await fetchClubVideos(userId);
      if (clubData) {
        const formattedVideos = clubData.map((video) => ({
          ID: video.ID,
          id_club: userId,
          Weekday: video.Weekday,
          Court_Number: video.Court_Number,
          originalHour: video.Hour,
          Hour: `${video.Hour}:${video.Hour_Section == 0 ? '00' : '30'}`,
          Hour_Section: video.Hour_Section,
          URL: video.URL || null,
          Blocked: video.Blocked,
          videoStatus: video.URL ? "Sí" : "No",
          UID: video.UID,
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
            {/* YouTube Status Card */}
            <div className="backdrop-blur-sm bg-white/2 rounded-2xl border border-white/10 overflow-hidden p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${youtubeStatus.connected ? 'bg-[#B8E016]/10 border border-[#B8E016]/20' : 'bg-white/5 border border-white/10'}`}>
                    <svg className={`w-4 h-4 ${youtubeStatus.connected ? 'text-[#B8E016]' : 'text-white/30'}`} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/80 font-medium text-sm leading-tight">YouTube</p>
                    <p className={`text-xs mt-0.5 ${youtubeStatus.connected ? 'text-[#B8E016]/70' : 'text-white/30'}`}>
                      {youtubeStatus.connected ? t('youtubeConnected') : t('youtubeNotConnected')}
                    </p>
                  </div>
                </div>
                {youtubeStatus.connected ? (
                  <button
                    onClick={handleDisconnectYouTube}
                    className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-medium hover:bg-red-500/20 transition-all duration-200"
                  >
                    {t('disconnect')}
                  </button>
                ) : (
                  <button
                    onClick={() => youtubeStatus.authUrl && window.open(youtubeStatus.authUrl, 'youtube-auth', 'width=500,height=600')}
                    className="px-3 py-1.5 bg-gradient-to-r from-[#acbb22]/20 to-[#B8E016]/10 text-[#B8E016] border border-[#acbb22]/25 rounded-xl text-xs font-medium hover:from-[#acbb22]/30 hover:to-[#B8E016]/20 transition-all duration-200"
                  >
                    {t('connect')}
                  </button>
                )}
              </div>
            </div>
            
            {/* Cameras Table */}
            {cameras.length > 0 ? (
              <>
                <div className="relative sm:hidden backdrop-blur-sm bg-white/2 rounded-2xl border border-white/10 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#acbb22]/30 to-transparent pointer-events-none z-10"></div>
                  <TableAnt
                    columns={livesColumns(cameras, rtmpKeys, handleInputChange, handleStartLive, handleStopLive, connectingCameras, t)}
                    data={cameras}
                    needsExpand={true}
                    needsVirtual={true}
                  />
                </div>
                <div className="relative hidden lg:block backdrop-blur-sm bg-white/2 rounded-2xl border border-white/10 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#acbb22]/30 to-transparent pointer-events-none z-10"></div>
                  <TableAnt
                    columns={livesColumns(cameras, rtmpKeys, handleInputChange, handleStartLive, handleStopLive, connectingCameras, t)}
                    data={cameras}
                    needsExpand={false}
                    needsVirtual={false}
                  />
                </div>
              </>
            ) : (
              <EmptyState type="cameras" />
            )}
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