import React, { useEffect } from "react";
import { Stream } from "@cloudflare/stream-react";

const VideoPlayer = ({ videoRef, onVideoLoaded, uid }) => {
  useEffect(() => {
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
    <Stream
      streamRef={videoRef}
      controls
      src={uid}
      onCanPlay={() => onVideoLoaded(true)}
    />
  );
};

export default VideoPlayer;