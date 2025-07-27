import React, { useEffect, useRef, useState } from "react";
import VideoPlayer from "../../components/videoView/VideoPlayer";
import ProgressBar from "../../components/ProgressBar";
import { useLocation } from "react-router-dom";
import { Button } from "@headlessui/react";
import clockIcon from "../../src/assets/clock.svg";
import { fetchVideoData, createDownload, fetchDownload, selectDownload, updateDownload } from "../controllers/serverController";

const ClipView = ({ triggerNotification }) => {
  const videoRef = useRef(null);
  const [isClipReady, setIsClipReady] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);
  const [progressMessage, setProgressMessage] = useState(null);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [percent, setPercent] = useState(0);
  const location = useLocation();
  const clipUID = location.state?.videoUID;

  //Progress bar items
  let items=[
    {
      title: 'Creating Clip',
      description: 'Video is being clipped'
    },
    {
      title: ' Download',
      description: 'Generating link to download video locally'
    },
    {
      title: 'Saving in Account',
      description: 'The clip has been saved in your account'
    },
  
  ]


  useEffect(() => {
    if (!clipUID) return;

    const checkClipAndDownload = async () => {
      try {
        // Wait for video to be ready
        const firstCheck = await fetchVideoData(clipUID);
        console.log(firstCheck)
        if(firstCheck.success){
          if (firstCheck.result.readyToStream) { //First check to not display progressBar but a notification
            triggerNotification("info", "Loading Clip");
          } else { //Show progress bar with steps
            setShowProgressBar(true);
            setCurrentStep(0);
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
        if (download[0]?.downloadURL) {
          setDownloadURL(download[0].downloadURL);
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

  const handleDownloadVideo = async (url) => {
    try {
      console.log("Downloading video...");
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'clip.mp4');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
    }
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
    <div className="main-page w-full">
      <div className="mx-auto lg:w-4/6 md:w-5/6 h-3/6">
      {/* <ProgressBar items={items} current={2} percent={80}/> */}
        <div className=" mb-5 rounded-md px-6 py-2">
          {showProgressBar ? (
            <ProgressBar items={items} current={currentStep} percent={percent}/>
          ) : (
            <p className="text-center text-gray-500">{progressMessage}</p>
          )}
        </div>
        
        {isClipReady && <VideoPlayer videoRef={videoRef} onVideoLoaded={setIsVideoLoaded} uid={clipUID} />}

        {isVideoLoaded && (
          <div className="mt-5 w-full max-w-lg px-4 mx-auto flex justify-center gap-4">
            <Button
              className="self-center inline-flex items-center gap-2 rounded-md bg-[#DDF31A] py-1.5 px-3 text-sm font-semibold text-black shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 disabled:opacity-50"
              disabled={!downloadURL}
              onClick={() => handleDownloadVideo(downloadURL)}
            >
              Download Video
            </Button>
            <Button className="ml-1 flex-end inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-2 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600">
              <img src={clockIcon} alt="" className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClipView;
