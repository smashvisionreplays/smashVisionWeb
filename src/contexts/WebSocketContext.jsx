import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [liveUpdates, setLiveUpdates] = useState({});
  const { getToken } = useAuth();
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const wsUrl = `${import.meta.env.VITE_WS_URL}/ws?token=${token}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected to:', wsUrl);
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setSocket(null);
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectTimeoutRef.current = setTimeout(connect, delay);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      setSocket(ws);
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  };

  const handleWebSocketMessage = (data) => {
    console.log('Handling WebSocket message:', data);
    switch (data.type) {
      case 'RELOAD_CAMERAS':
        console.log('Processing RELOAD_CAMERAS signal');
        // Trigger reload by updating a timestamp
        setLiveUpdates(prev => ({
          ...prev,
          _reloadTrigger: Date.now()
        }));
        break;
      
      case 'LIVE_STREAM_STARTED':
      case 'LIVE_STREAM_STOPPED':
        console.log('Processing legacy stream message, triggering reload');
        // Trigger reload for legacy messages
        setLiveUpdates(prev => ({
          ...prev,
          _reloadTrigger: Date.now()
        }));
        break;
      
      default:
        console.log('Unknown WebSocket message type:', data.type);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (socket) {
      socket.close();
    }
  };

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  const value = {
    socket,
    isConnected,
    liveUpdates,
    connect,
    disconnect
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};