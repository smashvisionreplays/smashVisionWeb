import { useRef, useState } from "react";
import { Input, Select, Button, ConfigProvider, theme, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { SignIn } from "@clerk/clerk-react";
import clockIcon from "../../src/assets/clock.svg";
import { registerClip } from '../../src/controllers/serverController';
import TopNotification from '../TopNotification';
import { useLanguage } from '../../src/contexts/LanguageContext';

const { TextArea } = Input;

// Constants
const MAX_TIME_FOR_CLIPS = 60;
const MIN_TIME_FOR_CLIPS = 5;

export default function CreateClipBox({ videoRef, clubId, userId }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isSignedIn, getToken } = useAuth();
  
  // Refs
  const startTimeRef = useRef("");
  const endTimeRef = useRef("");
  
  // State
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [tag, setTag] = useState(null);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [showSignInModal, setShowSignInModal] = useState(false);

  // Validation functions
  const validateClipTiming = (startClip, endClip, videoDuration) => {
    if (startClip < 0 || startClip > videoDuration || endClip < 0 || endClip > videoDuration) {
      return { success: false, message: "Clip start or end time cannot be out of video total times" };
    }

    const clipDuration = endClip - startClip;
    
    if (!videoDuration) {
      return { success: false, message: "Video Duration not available, reload page" };
    }
    if (clipDuration < MIN_TIME_FOR_CLIPS) {
      return { success: false, message: `Clip Duration must be longer than ${MIN_TIME_FOR_CLIPS} seconds` };
    }
    if (clipDuration > MAX_TIME_FOR_CLIPS) {
      return { success: false, message: `Clip Duration cannot be longer than ${MAX_TIME_FOR_CLIPS} seconds` };
    }
    
    return { success: true, message: "Clip inputs are valid" };
  };

  const validateFormEntries = (startTime, endTime, tag, videoDuration) => {
    const newErrors = {};
    
    if (startTime == null) newErrors.startTime = "Start time is required.";
    if (endTime == null) newErrors.endTime = "End Time is required.";
    if (!tag) newErrors.tag = "Tag is required.";

    if (Object.keys(newErrors).length > 0) return newErrors;

    const timingValidation = validateClipTiming(startTime, endTime, videoDuration);
    if (!timingValidation.success) {
      newErrors.clipTime = timingValidation.message;
    }

    return newErrors;
  };

  // Utility functions
  const convertSecondsToMinutes = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSeconds = Math.floor(secs % 60);
    const minutes = mins.toString().padStart(0, '0');
    const seconds = remainingSeconds.toString().padStart(2, '0');
    return { minutes, seconds };
  };

  const parseTimeInput = (timeString) => {
    const [minutes, seconds] = timeString.toString().split(':');
    return parseInt(minutes) * 60 + parseInt(seconds);
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Event handlers
  const setCurrentTime = (inputRef) => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const { minutes, seconds } = convertSecondsToMinutes(currentTime);
      const timeString = `${minutes}:${seconds}`;
      
      inputRef.current.value = timeString;
      
      if (inputRef === startTimeRef) setStartTime(timeString);
      if (inputRef === endTimeRef) setEndTime(timeString);
    }
  };

  const handleCreateClip = async () => {
    // Check if user is authenticated before proceeding
    if (!isSignedIn) {
      setShowSignInModal(true);
      return;
    }

    // Check if userId is available
    if (!userId) {
      showNotification('error', 'User information not available. Please try logging in again.');
      return;
    }

    const startTimeSeconds = parseTimeInput(startTime);
    const endTimeSeconds = parseTimeInput(endTime);

    // Validate form entries
    const formErrors = validateFormEntries(startTimeSeconds, endTimeSeconds, tag, videoRef.current.duration);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setErrors({});

    try {
      // Get authentication token
      const token = await getToken();
      
      const tagString = Array.isArray(tag) ? JSON.stringify(tag) : tag;

      const clipRegistered = await registerClip(
        videoRef.current.src,
        tagString,
        clubId,
        userId, 
        startTimeSeconds, 
        endTimeSeconds,
        token
      );
      
      if (clipRegistered?.success) {
        navigate(`/clipView`, { state: { videoUID: clipRegistered.result.clipUID } });
      } else {
        showNotification('error', `Clip registration failed: ${clipRegistered?.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error registering clip:", error);
      showNotification('error', 'Failed to create clip. Please try again.');
    }
  };

  return (
    <>
      {notification && (
        <TopNotification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      
      <ConfigProvider theme={{ 
        algorithm: theme.darkAlgorithm,
        components: {
          Select: {
            colorBgContainer: 'rgba(255, 255, 255, 0.05)',
            colorBorder: 'rgba(255, 255, 255, 0.1)',
            colorText: 'white',
            colorTextPlaceholder: 'rgba(255, 255, 255, 0.5)',
            controlOutline: 'rgba(221, 243, 26, 0.2)',
            colorPrimaryHover: '#DDF31A',
            colorPrimary: '#DDF31A',
          },
          Input: {
            colorBgContainer: 'rgba(255, 255, 255, 0.05)',
            colorBorder: 'rgba(255, 255, 255, 0.1)',
            colorText: 'white',
            colorTextPlaceholder: 'rgba(255, 255, 255, 0.5)',
            controlOutline: 'rgba(221, 243, 26, 0.2)',
            colorPrimaryHover: '#DDF31A',
            colorPrimary: '#DDF31A',
          }
        }
      }}>
        <div className="relative backdrop-blur-xl bg-white/[0.03] rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-6">
          {/* Top shimmer line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#acbb22]/30 to-transparent pointer-events-none"></div>

          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#acbb22] to-[#B8E016] shadow-[0_0_8px_rgba(172,187,34,0.4)] flex-shrink-0"></div>
            <h2 className="text-white/90 text-base font-semibold">{t('createClip')}</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
            <div className="flex flex-col gap-2">
              <p className="text-white/60 text-xs font-bold uppercase tracking-wider">{t('startTime')}</p>
              <div className="relative">
                <input
                  ref={startTimeRef}
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-[#DDF31A] focus:ring-1 focus:ring-[#DDF31A] transition-all outline-none"
                  type="text"
                  placeholder="00:00:00"
                />
                <button
                  onClick={() => setCurrentTime(startTimeRef)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#DDF31A] hover:text-[#B8E016] transition-colors"
                >
                  <span className="text-sm">Set</span>
                </button>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <p className="text-white/60 text-xs font-bold uppercase tracking-wider">{t('endTime')}</p>
              <div className="relative">
                <input
                  ref={endTimeRef}
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:border-[#DDF31A] focus:ring-1 focus:ring-[#DDF31A] transition-all outline-none"
                  type="text"
                  placeholder="00:00:00"
                />
                <button
                  onClick={() => setCurrentTime(endTimeRef)}
                  className="absolute right-3 top-1/2 -translate-y-1/2  text-[#DDF31A] hover:text-[#B8E016] transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">Set</span>
                </button>
              </div>
            </div>
          </div>
          
          {errors.clipTime && <p className="text-xs text-red-500 mb-4 relative z-10">{errors.clipTime}</p>}
          
          {/* Tag Selection */}
          <div className="mb-6 relative z-10">
            <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2">{t('tag')}</p>
            <Select
              onChange={setTag}
              className="w-full [&_.ant-select-selector]:!bg-white/5 [&_.ant-select-selector]:!border-white/10 [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!py-3 [&_.ant-select-selection-placeholder]:!text-white/50 [&_.ant-select-selection-item]:!text-white [&_.ant-select-selector]:focus:!border-[#DDF31A] [&_.ant-select-focused_.ant-select-selector]:!border-[#DDF31A] [&_.ant-select-focused_.ant-select-selector]:!shadow-[0_0_0_1px_#DDF31A]"
              dropdownStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0.75rem'
              }}
              placeholder={t('selectATag')}
              mode="tags"
              maxTagCount={1}
            >
              <Select.Option value="Blooper">{t('blooper')}</Select.Option>
              <Select.Option value="Good Point">{t('goodPoint')}</Select.Option>
              <Select.Option value="Forced Error">{t('forcedError')}</Select.Option>
            </Select>
            {errors.tag && <p className="text-xs text-red-500 mt-1">{errors.tag}</p>}
          </div>

          {/* Personal Note */}
          <div className="mb-6 relative z-10">
            <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2">{t('personalNote')}</p>
            <TextArea
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white resize-none focus:border-[#DDF31A] focus:ring-1 focus:ring-[#DDF31A] transition-all outline-none"
              rows={3}
              placeholder={t('makeNoteForClip')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0.75rem'
              }}
            />
          </div>
          
          <button
            onClick={handleCreateClip}
            className="w-full bg-gradient-to-r from-[#acbb22]/20 to-[#B8E016]/10 text-[#B8E016] border border-[#acbb22]/25 rounded-xl py-3.5 text-sm font-semibold hover:from-[#acbb22]/30 hover:to-[#B8E016]/20 hover:border-[#acbb22]/40 transition-all duration-200 relative z-10"
          >
            {isSignedIn ? t('createClip') : t('loginToCreateClip')}
          </button>
        </div>
      </ConfigProvider>
      
      {/* Sign In Modal */}
      <Modal
        open={showSignInModal}
        onCancel={() => setShowSignInModal(false)}
        footer={null}
        centered
        styles={{
          content: {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            border: '1px solid rgba(255, 255, 255, 0)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
          },
          mask: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)'
          }
        }}
      >
        
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox: "w-full",
                card: "bg-transparent w-full",
                headerTitle: "text-white",
                headerSubtitle: "text-white/70",
                socialButtonsBlockButton: "bg-white/10 border-white/20 text-white hover:bg-white/20 w-full",
                formFieldInput: "bg-white/10 border-white/20 text-white",
                formButtonPrimary: "bg-gradient-to-r from-[#acbb22] to-[#B8E016] hover:from-[#c9de17] hover:to-[#a3c614] text-black font-semibold w-full",
                footerActionLink: "text-[#DDF31A] hover:text-[#B8E016]",
                dividerLine: "bg-white/20",
                dividerText: "text-white/60",
                formFieldLabel: "text-white/80",
                identityPreviewText: "text-white",
                formResendCodeLink: "text-[#DDF31A] hover:text-[#B8E016]"
              }
            }}
            redirectUrl={window.location.href}
          />
      </Modal>
    </>
  );
}