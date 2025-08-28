import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import VideoPlayer from "../../components/videoView/VideoPlayer";
import CreateClipBox from "../../components/videoView/CreateClipBox";
import BestPointsTable from "../../components/videoView/TableActions";
import Notification from "../../components/Notification";
import { getVideoSeekTime } from "../scripts/utils";
import { fetchBestPoints } from "../../src/controllers/serverController";
import { useLanguage } from '../contexts/LanguageContext';

// Constants
const SECTION_OFFSET_MINUTES = 30;
const HOURS_TO_SECONDS = 3600;
const MINUTES_TO_SECONDS = 60;

const VideoView = ({ triggerNotification }) => {
  const videoRef = useRef(null);
  const location = useLocation();
  const { user } = useUser();
  const { id_club, weekday, hour, court_number, section, videoUID } = location.state;
  
  const userId = user?.privateMetadata?.id;

  // State
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [bestPoints, setBestPoints] = useState([]);
  const [startTime, setStartTime] = useState({ hour: 0, minute: 0, second: 0 });
  const [clockTime, setClockTime] = useState("00:00:00");
  const [activeTab, setActiveTab] = useState('createClip');
  const { t } = useLanguage();

  // Utility functions
  const formatTime = (hours, minutes, seconds) =>
    `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const calculateStartTime = useCallback(() => {
    const baseHour = section === 0 ? hour : Number(hour) + 1;
    const baseMinute = section === 0 ? SECTION_OFFSET_MINUTES : 0;
    
    if (!videoRef.current?.duration) {
      return { hour: baseHour, minute: baseMinute, second: 0 };
    }

    const totalStartSeconds = baseHour * HOURS_TO_SECONDS + baseMinute * MINUTES_TO_SECONDS - videoRef.current.duration;
    
    return {
      hour: Math.floor(totalStartSeconds / HOURS_TO_SECONDS),
      minute: Math.floor((totalStartSeconds % HOURS_TO_SECONDS) / MINUTES_TO_SECONDS),
      second: Math.round(totalStartSeconds % MINUTES_TO_SECONDS)
    };
  }, [hour, section, videoRef.current?.duration]);

  const updateClock = useCallback(() => {
    if (!videoRef.current) return;
    
    const elapsedSeconds = Math.floor(videoRef.current.currentTime);
    const totalSeconds = hour * HOURS_TO_SECONDS + startTime.minute * MINUTES_TO_SECONDS + startTime.second + elapsedSeconds;
    
    const hours = Math.floor(totalSeconds / HOURS_TO_SECONDS);
    const minutes = Math.floor((totalSeconds % HOURS_TO_SECONDS) / MINUTES_TO_SECONDS);
    const seconds = totalSeconds % MINUTES_TO_SECONDS;

    setClockTime(formatTime(hours, minutes, seconds));
  }, [startTime, hour]);

  // Event handlers
  const handleVideoLoaded = (loaded) => {
    setIsVideoLoaded(loaded);
  };

  const watchBestPoint = (record) => {
    if (!videoRef.current) return;
    
    const startTimeFormatted = formatTime(startTime.hour, startTime.minute, startTime.second);
    const seekTime = getVideoSeekTime(record.bestPoint, startTimeFormatted);
    videoRef.current.currentTime = seekTime;
  };

  // Effects
  useEffect(() => {
    const loadBestPoints = async () => {
      const params = { id_club, weekday, hour, court_number, section };
      
      try {
        const fetchedBestPoints = await fetchBestPoints(params);
        setBestPoints(
          fetchedBestPoints.map((point, index) => ({ 
            key: index, 
            bestPoint: point.Time 
          }))
        );
      } catch (error) {
        console.error("Error fetching best points:", error);
        triggerNotification?.("error", "Failed to load best points", error.message);
      }
    };

    loadBestPoints();
  }, [id_club, weekday, hour, court_number, section]);

  useEffect(() => {
    if (isVideoLoaded && videoRef.current) {
      const newStartTime = calculateStartTime();
      setStartTime(newStartTime);
      setClockTime(formatTime(newStartTime.hour, newStartTime.minute, newStartTime.second));
    }
  }, [isVideoLoaded, calculateStartTime]);

  useEffect(() => {
    if (isVideoLoaded && videoRef.current) {
      videoRef.current.addEventListener("timeupdate", updateClock);
      return () => videoRef.current?.removeEventListener("timeupdate", updateClock);
    }
  }, [isVideoLoaded, updateClock]);

  return (
    <div className="main-page w-full">
      <div className="mx-auto lg:w-4/6 md:w-5/6 h-3/6">
        <h3 id="clock" className="text-white text-center text-xl mb-2">
          {clockTime}
        </h3>
        
        <VideoPlayer 
          videoRef={videoRef} 
          onVideoLoaded={handleVideoLoaded} 
          uid={videoUID} 
        />
        
        {!isVideoLoaded ? (
          <div className="w-full h-full flex justify-center items-center">
            <Notification type="info" message="Loading Video" />
          </div>
        ) : (
          <>
            {/* Desktop Layout - Side by side */}
            <div className="hidden md:flex flex-row mt-5 mx-auto justify-center gap-10">
              <CreateClipBox videoRef={videoRef} clubId={id_club} userId={userId} />
              <BestPointsTable data={bestPoints} onWatch={watchBestPoint} />
            </div>
            
            {/* Mobile Layout - Tabs */}
            <div className="md:hidden mt-5">
              <div className="px-8 py-4">
                <div className=" ">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab('createClip')}
                      className={`rounded-t-xl py-2 px-4 text-sm font-semibold text-white/90 focus:outline-none transition-all duration-200 ease-in-out ${
                        activeTab === 'createClip'
                          ? 'bg-white/5'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      {'Create Clip'}
                    </button>
                    <button
                      onClick={() => setActiveTab('bestMoments')}
                      className={`rounded-t-xl py-2 px-4 text-sm font-semibold text-white/90 focus:outline-none transition-all duration-200 ease-in-out ${
                        activeTab === 'bestMoments'
                          ? 'bg-white/5'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      {t('bestMoments') || 'Best Moments'}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="px-4 -mt-4">
                {activeTab === 'createClip' ? (
                  <CreateClipBox videoRef={videoRef} clubId={id_club} userId={userId} />
                ) : (
                  <div className="w-full max-w-lg px-4 mx-auto">
                    <div className="space-y-6 rounded-b-xl bg-white/5 p-6 sm:p-10 flex flex-col justify-center align-middle">
                      <h2 className="text-base/7 font-semibold text-white self-center mb-3">
                        {t('bestMoments') || 'Best Moments'}
                      </h2>
                      <BestPointsTable data={bestPoints} onWatch={watchBestPoint} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoView;