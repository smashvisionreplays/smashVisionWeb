import React, { useEffect } from "react";
import { Stream } from "@cloudflare/stream-react";

const VideoPlayer = ({ videoRef, onVideoLoaded, uid }) => {
  useEffect(() => {
    console.log("VideoPlayer: in useffect");
    if (!videoRef?.current) return;

    const handleLoadedData = () => {
      console.log("VideoPlayer: video loaded successfully");
      onVideoLoaded(true);
    };

    const videoElement = videoRef.current;
    videoElement.addEventListener('loadeddata', handleLoadedData);

    return () => {
      videoElement.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [videoRef, onVideoLoaded]);

  return (
    <div className="relative group rounded-2xl overflow-hidden border border-white/5 aspect-video flex flex-col shadow-2xl w-full">
      <Stream
        streamRef={videoRef}
        controls
        src={uid}
        onCanPlay={() => onVideoLoaded(true)}
        style={{ borderRadius: '1rem' }}
      />
    </div>
  );
};

export default VideoPlayer;