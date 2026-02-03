import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import VideoPlayer from "../../components/videoView/VideoPlayer";
import CreateClipBox from "../../components/videoView/CreateClipBox";
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
    
    // Ensure seek time is within video bounds
    const clampedSeekTime = Math.max(0, Math.min(seekTime, videoRef.current.duration));
    
    videoRef.current.currentTime = clampedSeekTime;
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
    <div className=" w-[80%] mx-auto flex flex-col gap-10 sm:flex-row" style={{ marginTop: '6rem', marginBottom: '4rem' }}>
      <div className="mx-auto w-full">
        <h3 id="clock" className="text-white text-center text-xl mb-2">
          {clockTime}
        </h3>
        
        <VideoPlayer 
          videoRef={videoRef} 
          onVideoLoaded={handleVideoLoaded} 
          uid={videoUID} 
        />
        
        {/* Best Points Tags - Desktop Only */}
        {bestPoints.length > 0 && (
          <div className="mt-6 hidden md:block">
            <h4 className="text-white/80 text-sm font-semibold mb-4">Best Points</h4>
            <div className="flex flex-wrap gap-3">
              {bestPoints.map((point, index) => (
                <button
                  key={index}
                  onClick={() => watchBestPoint(point)}
                  className="relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#80ec13]/40 rounded-xl px-4 py-3 text-white/90 hover:text-white text-sm font-mono transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#80ec13]/10"
                  style={{
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div 
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(128, 236, 19, 0.05) 0%, transparent 70%)'
                    }}
                  />
                  <span className="relative z-10">{point.bestPoint}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className=" flex items-center">  
        {isVideoLoaded && (
          <>
            {/* Desktop Layout - Side by side */}
            <div className="hidden md:flex flex-col mt-5 mx-auto justify-center gap-10">
              <CreateClipBox videoRef={videoRef} clubId={id_club} userId={userId} />
            </div>
            
            {/* Mobile Layout - Tabs */}
            <div className="md:hidden mt-5 w-full">
              <div className="px-4">
                {/* Tab Navigation */}
                <div className="flex mb-2">
                  <button
                    onClick={() => setActiveTab('createClip')}
                    className={`flex-1 py-3 px-4 text-sm font-medium rounded-l-xl transition-all ${
                      activeTab === 'createClip'
                        ? 'bg-[#80ec13] text-black/70'
                        : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {t('createClipSimple')}
                  </button>
                  <button
                    onClick={() => setActiveTab('bestPoints')}
                    className={`flex-1 py-3 px-4 text-sm font-medium rounded-r-xl transition-all ${
                      activeTab === 'bestPoints'
                        ? 'bg-[#80ec13] text-black'
                        : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {t('bestPoints')}
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'createClip' ? (
                  <CreateClipBox videoRef={videoRef} clubId={id_club} userId={userId} />
                ) : (
                  <div className="liquid-glass iridescent-border rounded-2xl p-6" style={{
                    backdropFilter: 'blur(2px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                    background: 'transparent',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      content: '',
                      position: 'absolute',
                      top: '-50%',
                      left: '-50%',
                      width: '200%',
                      height: '200%',
                      background: 'radial-gradient(circle, rgba(128, 236, 19, 0.05) 0%, transparent 70%)',
                      pointerEvents: 'none'
                    }}></div>
                    
                    
                    <div className=" flex flex-col items-center justify-center gap-10 z-10">
                      <h2 className="text-white text-xl font-bold tracking-tight">Best Points</h2>
                      {bestPoints.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-3">
                          {bestPoints.map((point, index) => (
                            <button
                              key={index}
                              onClick={() => watchBestPoint(point)}
                              className="overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#80ec13]/40 rounded-xl px-4 py-3 text-white/90 hover:text-white text-sm font-mono transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#80ec13]/10"
                              style={{
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.1)'
                              }}
                            >
                              <div 
                                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                                style={{
                                  background: 'radial-gradient(circle at center, rgba(128, 236, 19, 0.05) 0%, transparent 70%)'
                                }}
                              />
                              <span className="relative z-10">{point.bestPoint}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/60 text-center py-8">No best points available</p>
                      )}
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