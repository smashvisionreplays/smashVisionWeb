import React, { useState, useRef, useEffect} from 'react';
import { Modal, ConfigProvider, theme  } from 'antd';
import VideoPlayer from "../components/videoView/VideoPlayer";
import { useNavigate } from "react-router-dom";

const App = ({videoData, isModalOpen, handleOk, handleCancel}) => {
    const videoRef = useRef(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    let navigate = useNavigate();

  useEffect(() => {
    if (!isModalOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isModalOpen]);

  const handleGoToCreateClip= ()=>{
    navigate(`/videoView`,
        { state: videoData
      });
  }

  const buildFooter = () => {
    return (
      <div key="footer" className="flex gap-3 justify-end pt-1">
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-white/5 text-white/60 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 hover:text-white/80 transition-all duration-200"
        >
          Close
        </button>

        {!videoData?.Clip_Name && (
          <button
            onClick={handleGoToCreateClip}
            className="px-4 py-2 bg-gradient-to-r from-[#acbb22]/20 to-[#B8E016]/10 text-[#B8E016] border border-[#acbb22]/25 rounded-xl text-sm font-medium hover:from-[#acbb22]/30 hover:to-[#B8E016]/20 transition-all duration-200"
          >
            Create Clip
          </button>
        )}
      </div>
    );
  }

  return (
    <>
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
          mask: {
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
          },
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
          header: {
            background: 'transparent',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            padding: '20px 24px 16px',
            marginBottom: 0,
          },
          body: {
            padding: '20px 24px',
          },
          footer: {
            background: 'transparent',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            padding: '14px 24px',
            marginTop: 0,
          },
        },
      }}
    >

    <Modal
        title={
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#acbb22] to-[#B8E016] shadow-[0_0_8px_rgba(172,187,34,0.4)] flex-shrink-0"></div>
            <span className="text-white/90 font-semibold text-base">
              {videoData?.Clip_Name || 'Video'}
            </span>
          </div>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={buildFooter}
        width={{
          xs: '90%',
          sm: '80%',
          md: '70%',
          lg: '60%',
          xl: '50%',
          xxl: '40%',
        }}
        closeIcon={
          <span className="text-white/40 hover:text-white/80 transition-colors duration-200 text-lg leading-none">✕</span>
        }
    >
        <VideoPlayer videoRef={videoRef} onVideoLoaded={setIsVideoLoaded} uid={videoData?.videoUID} />
    </Modal>

  </ConfigProvider>

    </>
  );
};
export default App;
