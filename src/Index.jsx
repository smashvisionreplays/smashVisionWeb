import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import NavBarTW from '../components/NavBarTW';
import Notification from '../components/Notification';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import '../stylesheet/index.css';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import VideoView from './pages/VideoView';
import ClipView from './pages/ClipView';
import Login from './pages/Login';
import Tournaments from './pages/Tournaments';
import Lives from './pages/Lives';
import {ConfigProvider, Steps, theme } from 'antd';

const Index = () => {
  const [notification, setNotification] = useState(null);

  // Function to trigger a notification
  const triggerNotification = (type, message, description) => {
    setNotification({ type, message, description });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        components: {
          Steps:{
            navArrowColor: '#0000',
          }
        },
      }}
    >
      <div>
        <NavBarTW />
        
        <div className="w-full h-min flex justify-center items-center px-6 lg:px-20 mb-5">
          {notification && (
            <Notification 
              type={notification.type} 
              message={notification.message} 
              description={notification.description} 
            />
          )}
        </div>

        <Routes>
          <Route path="/" element={<Home triggerNotification={triggerNotification} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/lives" element={<Lives />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard triggerNotification={triggerNotification} />
              </ProtectedRoute>
            } 
          />
          <Route path="/videoView" element={<VideoView triggerNotification={triggerNotification} />} />
          <Route 
            path="/clipView" 
            element={
              <ProtectedRoute>
                <ClipView triggerNotification={triggerNotification} />
              </ProtectedRoute>
            } 
          />
        </Routes>      
      </div>
    </ConfigProvider>
  );
};

export default Index;