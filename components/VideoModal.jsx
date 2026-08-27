import React, { useState, useRef, useEffect} from 'react';
import { Modal, ConfigProvider } from 'antd';
import { glassModalTheme, glassModalStyles } from './glassModalTheme';
import VideoPlayer from "../components/videoView/VideoPlayer";
import { useNavigate } from "react-router-dom";
import { useLanguage } from '../src/contexts/LanguageContext';
import { buildVideoViewSearch } from '../src/scripts/utils';

const App = ({videoData, isModalOpen, handleOk, handleCancel}) => {
    const { t } = useLanguage();
    const videoRef = useRef(null);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    let navigate = useNavigate();

  useEffect(() => {
    if (!isModalOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isModalOpen]);

  const handleGoToCreateClip= ()=>{
    navigate(`/videoView?${buildVideoViewSearch(videoData)}`, { state: videoData });
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
    <ConfigProvider theme={glassModalTheme} modal={{ styles: glassModalStyles }}>

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

        {videoData?.Clip_Name && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#acbb22]/30 to-transparent pointer-events-none"></div>
            <div className="flex items-start gap-3 p-4">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#acbb22] to-[#B8E016] shadow-[0_0_8px_rgba(172,187,34,0.4)] flex-shrink-0 mt-0.5"></div>
              <div>
                <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">{t('personalNote')}</p>
                {videoData?.note
                  ? <p className="text-white/80 text-sm leading-relaxed">{videoData.note}</p>
                  : <p className="text-white/30 text-sm italic">{t('noNotesFound')}</p>
                }
              </div>
            </div>
          </div>
        )}
    </Modal>

  </ConfigProvider>

    </>
  );
};
export default App;
