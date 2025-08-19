import React, { useEffect, useState } from 'react';
import { fetchClubs, fetchClubById, fetchVideos } from '../../src/controllers/serverController';
import { useNavigate } from "react-router-dom";
import { DatePicker, TimePicker, Form, Button, Space, Select, ConfigProvider, theme } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const dateFormat = 'YYYY-MM-DD';
const todayDate = new Date();
const dateOffset = (24 * 60 * 60 * 1000) * 7; // 7 days
const lastWeekDate = new Date(todayDate.getTime() - dateOffset);

const formatDateString = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const todayString = formatDateString(todayDate);
const lastWeekString = formatDateString(lastWeekDate);

const BlurredContainer = ({ triggerNotification }) => {
  const [clubs, setClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [selectedClub, setSelectedClub] = useState({});
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs(todayString, dateFormat));
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Load clubs on component mount
  useEffect(() => {
    const loadClubs = async () => {
      try {
        const fetchedClubs = await fetchClubs();
        const formattedClubs = fetchedClubs.map((club) => ({
          value: club.ID,
          label: club.Name,
          icon: club.Logo && <img alt="" src={club.Logo} className="w-5 h-5 rounded-full" />,
        }));
        setClubs(formattedClubs);
      } catch (error) {
        console.error("Error loading clubs:", error);
        triggerNotification?.("error", "Failed to load clubs");
      }
    };

    loadClubs();
  }, []);



  // Load courts when club is selected
  useEffect(() => {
    const loadCourts = async () => {
      if (selectedClubId) {
        try {
          const clubData = await fetchClubById(selectedClubId);
          if (clubData && clubData[0]) {
            const courtsSplit = clubData[0]["Courts_Number"].split(",");
            const courtsNumbers = courtsSplit.map(court => parseInt(court));
            setCourts(courtsNumbers);
          }
        } catch (error) {
          console.error("Error loading courts:", error);
          triggerNotification?.("error", "Failed to load courts");
        }
      }
    };

    loadCourts();
  }, [selectedClubId]);

  const convert24To12 = (time) => {
    const [hours, minutes, modifier] = time.split(/ |:/);
    let convertedHours = hours;
    if (modifier === 'pm' && hours !== '12') {
      convertedHours = `${parseInt(hours, 10) + 12}`;
    }
    return `${convertedHours}:${minutes}`;
  };

  const handleTimeSelect = (time, timeString) => {
    setSelectedTime(timeString);
  };

  const handleSeeVideo = async () => {
    if (!selectedClubId || !selectedCourt || !selectedDate || !selectedTime) {
      triggerNotification?.("error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const section = selectedTime.split(":")[1].includes("00") ? 0 : 1;
      const params = {
        id_club: selectedClubId,
        weekday: selectedDate.toDate().toLocaleString('en', { weekday: 'long' }),
        court_number: selectedCourt,
        hour: convert24To12(selectedTime).split(":")[0],
        section: section
      };

      const video = await fetchVideos(params);
      
      if (video.length === 0 || video[0].URL === null) {
        triggerNotification?.("error", "Video Not Found", "No video available for the selected time and court");
      } else {
        navigate(`/videoView`, {
          state: {
            videoUID: video[0].UID,
            id_club: selectedClubId,
            weekday: selectedDate.toDate().toLocaleString('en', { weekday: 'long' }),
            court_number: selectedCourt,
            hour: convert24To12(selectedTime).split(":")[0],
            section: section
          }
        });
      }
    } catch (error) {
      console.error("Error fetching video:", error);
      triggerNotification?.("error", "Failed to fetch video");
    } finally {
      setLoading(false);
    }
  };

  const labelRender = (props) => {
    const { label } = props;
    if (label && selectedClub) {
      return (
        <span className="flex items-center gap-3">
          {selectedClub.icon}
          <span className="block truncate">{selectedClub.label}</span>
        </span>
      );
    }
    return <span>Select a club</span>;
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 mx-auto">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-3xl"></div>
      
      <div className="relative z-10">
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
            components: {
              Select: {
                colorTextPlaceholder: "rgba(0,0,0,0.6)",
                colorBorder: "rgba(255,255,255,0.2)",

              },
              DatePicker: {
                colorTextPlaceholder: "rgba(0,0,0,0.6)",
                colorBorder: "rgba(255,255,255,0.2)",
                
              },
              TimePicker: {
                colorTextPlaceholder: "rgba(0,0,0,0.6)",
                colorBorder: "rgba(255,255,255,0.2)",
              },
              Button: {
                colorPrimary: "#DDF31A",
                colorPrimaryHover: "#c9de17",
              }
            },
          }}
        >
          <Form
            layout="vertical"
            onFinish={handleSeeVideo}
            className="space-y-6"
            initialValues={{
              date: dayjs(todayString, dateFormat)
            }}
          >
            {/* Club Selection */}
            <Form.Item
              label={<span className="text-white/90 font-medium text-base">Club</span>}
              name="club"
              rules={[{ required: true, message: 'Please select your club!' }]}
            >
              <Select
                size="large"
                placeholder="Select your club"
                onChange={(value) => {
                  const club = clubs.find(item => item.value === parseInt(value));
                  setSelectedClub(club);
                  setSelectedClubId(parseInt(value));
                }}
                options={clubs}
                labelRender={labelRender}
                optionRender={(club) => (
                  <Space>
                    <span className="flex items-center gap-3">
                      {club.data.icon}
                      <span className="block truncate">{club.data.label}</span>
                    </span>
                  </Space>
                )}
              />
            </Form.Item>

            {/* Court Selection */}
            <Form.Item
              label={<span className="text-white/90 font-medium text-base">Court</span>}
              name="court"
              rules={[{ required: true, message: 'Please select a court!' }]}
            >
              <Select
                size="large"
                placeholder="Select court number"
                onChange={setSelectedCourt}
                options={courts.map((court) => ({ label: `Court ${court}`, value: court }))}
                disabled={!selectedClubId}
              />
            </Form.Item>

            {/* Date Selection */}
            <Form.Item
              label={<span className="text-white/90 font-medium text-base">Date</span>}
              name="date"
              rules={[{ required: true, message: 'Please select the date!' }]}
            >
              <DatePicker
                size="large"
                style={{ width: '100%' }}
                value={selectedDate}
                minDate={dayjs(lastWeekString, dateFormat)}
                maxDate={dayjs(todayString, dateFormat)}
                onChange={(date) => date && setSelectedDate(date)}
                allowClear={false}
                className="glass-input"
              />
            </Form.Item>

            {/* Time Selection */}
            <Form.Item
              label={<span className="text-white/90 font-medium text-base">Time</span>}
              name="time"
              rules={[{ required: true, message: 'Please select the time!' }]}
            >
              <TimePicker
                size="large"
                style={{ width: '100%',  }}
                use12Hours
                format="h:mm a"
                minuteStep={30}
                onChange={handleTimeSelect}
                classNames={{
                  popup: {
                    root: 'timepicker-popup'
                  }
                }}
              />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item className="mb-0 pt-4">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                className="w-full h-12 bg-[#DDF31A] hover:bg-[#c9de17] border-none text-black font-semibold rounded-xl shadow-lg transition-all duration-200"
              >
                {loading ? 'Searching...' : 'Find My Game'}
              </Button>
            </Form.Item>
          </Form>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default BlurredContainer;