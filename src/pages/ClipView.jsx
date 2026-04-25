import React, { useEffect, useRef, useState } from "react";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
};
import VideoPlayer from "../../components/videoView/VideoPlayer";
import ProgressBar from "../../components/ProgressBar";
import { useLocation } from "react-router-dom";
import { fetchVideoData, createDownload, fetchDownload, selectDownload, updateDownload } from "../controllers/serverController";
import { useLanguage } from "../contexts/LanguageContext";

const ClipView = ({ triggerNotification }) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const videoRef = useRef(null);
  const [isClipReady, setIsClipReady] = useState(false);
  const [clipAlreadyReady, setClipAlreadyReady] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);
  const [progressMessage, setProgressMessage] = useState(null);
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [percent, setPercent] = useState(0);
  const location = useLocation();
  const clipUID = location.state?.videoUID;
  const clipNote = location.state?.note;

  //Progress bar items
  let items=[
    {
      title: t('creatingClip'),
      description: t('videoBeingClipped')
    },
    {
      title: t('downloadStep'),
      description: t('generatingDownloadLink')
    },
    {
      title: t('savingInAccount'),
      description: t('clipSavedInAccount')
    },
  
  ]


  useEffect(() => {
    if (!clipUID) return;

    const checkClipAndDownload = async () => {
      try {
        // Wait for video to be ready
        const firstCheck = await fetchVideoData(clipUID);
        // console.log(firstCheck)
        if(firstCheck.success){
          if (firstCheck.result.readyToStream) {
            setShowProgressBar(false);
            setClipAlreadyReady(true);
          } else { //Show progress bar with steps
            await waitForClipReady(clipUID);
            setCurrentStep(1);
          }
        }else{
          triggerNotification("error", "There was an error loading the clip, you might want to reload page.");
          //We should reload the page and handle max limit of reloads (maybe put this in a while true and retries!= maxtries)
        }
        // Wait for Clip to be ready
        
        setIsClipReady(true);
        setProgressMessage("Clip ready to be played")

        // Check if a download URL exists, if not, create it
        let download = await selectDownload(clipUID);
        if (download[0]?.downloadurl) {
          setDownloadURL(download[0].downloadurl);
          setProgressMessage(`Clip ready to be played, and clip can be downloaded`);
        } else {
          const newDownload = await createDownload(clipUID);
          await waitForDownloadReady(clipUID, newDownload.result.default.url);
        }
      } catch (error) {
        console.error("Error processing video:", error);
        setProgressMessage("An error occurred.");
      }
    };

    checkClipAndDownload();
  }, []);

  const handleDownloadVideo = () => {
    const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
    window.location.href = `${API_BASE_URL}/clips/${clipUID}/download/file`;
  };

  const waitForClipReady = async (id) => {
    return new Promise((resolve) => {
      const intervalId = setInterval(async () => {
        const videoData = await fetchVideoData(id);
        if (videoData.result.readyToStream) {
          clearInterval(intervalId);
          setPercent(100);
          // console.log("percent clip ready is 100%")
          resolve(true);
        } else {
          const progress = videoData.result.status.pctComplete || 0;
          setPercent(progress);
          // console.log("percent clip ready is", progress)
        }
      }, 3000);
    });
  };

  const waitForDownloadReady = async (id, url) => {
    return new Promise((resolve) => {
      const intervalId = setInterval(async () => {
        const downloadData = await fetchDownload(id);
        if (downloadData.result.default.status === "ready") {
          // console.log("download link is ready")
          clearInterval(intervalId);
          setDownloadURL(url);
          await updateDownload(url, id);
          setPercent(100);

          //Move to last step (mock step)
          setCurrentStep(2);
          setTimeout(() => {
            setPercent(50)
          }, "1000");
          setTimeout(() => {
            setPercent(100)
            setCurrentStep(3)
          }, "1000");

          resolve(true);
        }else{
          let dataPercentage=downloadData.result.default.percentComplete || 0
          let percentage = dataPercentage > 30 ? dataPercentage : 30;
          setPercent(percentage)
          // console.log(`percent download... ${downloadData.result.default.percentComplete || 10}%`);
        }
      }, 3000);
    });
  };


  return (
    <div
      className={`w-full ${!isClipReady ? 'flex items-center justify-center' : ''}`}
      style={{ marginTop: isMobile ? '4rem' : '6rem', minHeight: !isClipReady ? '60vh' : 'auto' }}
    >
      <div className="mx-auto lg:w-4/6 md:w-5/6 w-full px-4 sm:px-6">

        {clipAlreadyReady && (
          <div className="flex flex-col items-center text-center gap-2 pb-6">
            <div className="w-12 h-12 rounded-full bg-[#acbb22]/10 border border-[#acbb22]/25 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B8E016" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-[#B8E016]">{t('clipReadyTitle')}</h2>
            <p className="text-gray-400 max-w-sm text-sm leading-relaxed">{t('clipReadyDescription')}</p>
          </div>
        )}

        {!clipAlreadyReady && (
          <div className="mb-5 rounded-md py-2">
            {showProgressBar ? (
              <ProgressBar
                items={items}
                current={currentStep}
                percent={percent}
                direction={isMobile ? 'vertical' : 'horizontal'}
              />
            ) : (
              <p className="text-center text-gray-500">{progressMessage}</p>
            )}
          </div>
        )}

        {isClipReady && <VideoPlayer videoRef={videoRef} onVideoLoaded={setIsVideoLoaded} uid={clipUID} />}

        {isVideoLoaded && (
          <div className="mt-5 mx-auto flex justify-center">
            <button
              disabled={!downloadURL}
              onClick={handleDownloadVideo}
              className="w-full sm:w-auto bg-gradient-to-r from-[#acbb22]/20 to-[#B8E016]/10 text-[#B8E016] border border-[#acbb22]/25 rounded-xl py-2.5 px-5 text-sm font-semibold hover:from-[#acbb22]/30 hover:to-[#B8E016]/20 hover:border-[#acbb22]/40 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('downloadVideo')}
            </button>
          </div>
        )}

        {isVideoLoaded && clipNote && (
          <div className="mt-5 relative backdrop-blur-xl bg-white/[0.03] rounded-2xl border border-white/10 shadow-xl overflow-hidden p-5">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#acbb22]/30 to-transparent pointer-events-none"></div>
            <div className="flex items-start gap-3">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#acbb22] to-[#B8E016] shadow-[0_0_8px_rgba(172,187,34,0.4)] flex-shrink-0 mt-0.5"></div>
              <div>
                <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">{t('personalNote')}</p>
                <p className="text-white/80 text-sm leading-relaxed">{clipNote}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ClipView;
