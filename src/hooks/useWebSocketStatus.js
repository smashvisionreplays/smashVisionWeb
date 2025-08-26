import { useEffect, useState } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';

export const useWebSocketStatus = (cameras) => {
  const { liveUpdates } = useWebSocket();
  const [updatedCameras, setUpdatedCameras] = useState(cameras);

  useEffect(() => {
    console.log('useWebSocketStatus - cameras:', cameras?.length, 'liveUpdates:', Object.keys(liveUpdates));
    
    if (!cameras || cameras.length === 0) {
      setUpdatedCameras([]);
      return;
    }

    const updated = cameras.map(camera => {
      const liveUpdate = liveUpdates[camera.ID];
      if (liveUpdate && liveUpdate.timestamp > Date.now() - 30000) { // Only use updates from last 30 seconds
        console.log(`Applying WebSocket update to camera ${camera.ID}:`, liveUpdate);
        return {
          ...camera,
          status: liveUpdate.status,
          url: liveUpdate.url,
          notes: liveUpdate.notes
        };
      }
      return camera;
    });

    console.log('useWebSocketStatus - updated cameras:', updated.map(c => ({ id: c.ID, status: c.status })));
    setUpdatedCameras(updated);
  }, [cameras, liveUpdates]);

  return updatedCameras;
};