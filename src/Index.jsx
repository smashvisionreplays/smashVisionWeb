import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";

function Analytics() {
  const location = useLocation();
  useEffect(() => {
    window.gtag?.('config', import.meta.env.VITE_GA_MEASUREMENT_ID, { page_path: location.pathname });
  }, [location]);
  return null;
}
import NavBarTW from '../components/NavBarTW';
import TopNotification from '../components/TopNotification';
import Footer from '../components/Footer';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import '../stylesheet/index.css';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import VideoView from './pages/VideoView';
import ClipView from './pages/ClipView';
import Login from './pages/Login';
import Tournaments from './pages/Tournaments';
import Lives from './pages/Lives';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import {ConfigProvider, Steps, theme } from 'antd';

const Index = () => {
  const [notification, setNotification] = useState(null);

  // Function to trigger a notification
  const triggerNotification = (type, message, description, timing = true) => {
    setNotification({ type, message, description, timing });
    if (timing) {
      setTimeout(() => setNotification(null), 5000);
    }
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
      <div className="flex flex-col min-h-screen">
        <Analytics />
        <NavBarTW />

        {notification && (
          <TopNotification
            type={notification.type}
            message={notification.message}
            description={notification.description}
            timing={notification.timing}
            onClose={() => setNotification(null)}
          />
        )}

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home triggerNotification={triggerNotification} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/about" element={<About />} />
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
<Route path="/terms/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms/terms-and-conditions" element={<TermsAndConditions />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </ConfigProvider>
  );
};

export default Index;