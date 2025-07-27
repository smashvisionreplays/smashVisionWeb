import { useRef, useState } from "react";
import { Input, Select, Button, ConfigProvider, theme } from "antd";
import { useNavigate } from "react-router-dom";
import clockIcon from "../../src/assets/clock.svg";
import { registerClip } from '../../src/controllers/serverController';
import TopNotification from '../TopNotification';

const { TextArea } = Input;

// Constants
const MAX_TIME_FOR_CLIPS = 60;
const MIN_TIME_FOR_CLIPS = 5;
const CLUB_ID = 8;
const USER_ID = 62;

export default function CreateClipBox({ videoRef }) {
  const navigate = useNavigate();
  
  // Refs
  const startTimeRef = useRef("");
  const endTimeRef = useRef("");
  
  // State
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [tag, setTag] = useState(null);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

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
      const clipRegistered = await registerClip(
        videoRef.current.src, 
        tag, 
        CLUB_ID, 
        USER_ID, 
        startTimeSeconds, 
        endTimeSeconds
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
      
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <div className="w-full max-w-lg px-4">
          <div className="space-y-6 rounded-xl bg-white/5 p-6 sm:p-10 flex flex-col justify-center align-middle">
            <h2 className="text-base/7 font-semibold text-white self-center mb-3">
              Create Clip of my Game!
            </h2>

            {/* Time Input Section */}
            <div className="w-full gap-10 flex flex-row">
              <div className="w-full">
                <label className="text-sm/6 font-medium text-white flex justify-between items-center">
                  Start Time
                  <Button
                    onClick={() => setCurrentTime(startTimeRef)}
                    className="ml-1 flex-end inline-flex items-center gap-2 bg-gray-700 text-white border-none shadow-inner hover:bg-gray-600"
                    size="small"
                  >
                    <img src={clockIcon} alt="" className="w-4 h-4" />
                  </Button>
                </label>
                <p className="text-sm/6 text-white/50">Use the button to get current time in the video.</p>
                <Input
                  ref={startTimeRef}
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="mt-3 block w-full rounded-lg bg-white/5 text-white"
                />
              </div>

              <div className="w-full">
                <label className="text-sm/6 font-medium text-white flex justify-between items-center">
                  End Time
                  <Button
                    onClick={() => setCurrentTime(endTimeRef)}
                    className="ml-1 flex-end inline-flex items-center gap-2 bg-gray-700 text-white border-none shadow-inner hover:bg-gray-600"
                    size="small"
                  >
                    <img src={clockIcon} alt="" className="w-4 h-4" />
                  </Button>
                </label>
                <p className="text-sm/6 text-white/50">Use the button to get current time in the video.</p>
                <Input
                  ref={endTimeRef}
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="mt-3 block w-full rounded-lg bg-white/5 text-white"
                />
              </div>
            </div>
            {errors.clipTime && <p className="text-xs text-red-500">{errors.clipTime}</p>}

            {/* Tag Selection */}
            <div>
              <label className="text-sm/6 font-medium text-white">Tag</label>
              <p className="text-sm/6 text-white/50">Classify your clip</p>
              <Select
                onChange={setTag}
                className="mt-3 w-full"
                dropdownStyle={{ color: "black" }}
                placeholder="Select a tag"
                mode="tags"
                maxTagCount={1}
              >
                <Select.Option value="Blooper">Blooper</Select.Option>
                <Select.Option value="Good Point">Good Point</Select.Option>
                <Select.Option value="Forced Error">Forced Error</Select.Option>
              </Select>
              {errors.tag && <p className="text-xs text-red-500">{errors.tag}</p>}
            </div>

            {/* Personal Note */}
            <div>
              <label className="text-sm/6 font-medium text-white">Personal Note</label>
              <p className="text-sm/6 text-white/50">Make a note for yourself about this clip.</p>
              <TextArea
                className="mt-3 block w-full resize-none rounded-lg bg-white/5 text-white"
                rows={3}
              />
            </div>

            <Button
              className="self-center inline-flex items-center gap-2 bg-[#DDF31A] text-black shadow-inner hover:bg-gray-600"
              onClick={handleCreateClip}
            >
              Create Clip
            </Button>
          </div>
        </div>
      </ConfigProvider>
    </>
  );
}