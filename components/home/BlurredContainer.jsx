import React, { useEffect, useState } from 'react';
import { fetchClubs, fetchClubById, fetchVideos } from '../../src/controllers/serverController';
import { useNavigate } from "react-router-dom";
import { DatePicker, TimePicker, Form, Button, Space, Select, ConfigProvider, theme } from 'antd';
import { useLanguage } from '../../src/contexts/LanguageContext';
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
  const { t } = useLanguage();
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
        const filteredClubs = fetchedClubs.filter(club => club.status === "active");
        const formattedClubs = filteredClubs.map((club) => ({
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
      triggerNotification?.("error", t('fillAllFields'));
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
        triggerNotification?.("error", t('videoNotFound'), t('noVideoAvailable'));
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
    <div className="relative backdrop-blur-sm rounded-3xl border border-t-white/10 border-l-white/10 border-b-white/25 border-r-white/25 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] p-8 mx-auto overflow-hidden">
      {/* Liquid glass effect overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none rounded-3xl"></div>
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-3xl"></div>
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full blur-lg pointer-events-none"></div>
      
      <div className="relative z-10">
        <ConfigProvider
          theme={{
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
                borderRadius: 12,
                borderRadiusLG: 12,
              },
              DatePicker: {
                colorBgContainer: 'rgba(255, 255, 255, 0.05)',
                colorBorder: 'rgba(255, 255, 255, 0.1)',
                colorText: 'white',
                colorTextPlaceholder: 'rgba(255, 255, 255, 0.5)',
                controlOutline: 'rgba(221, 243, 26, 0.2)',
                colorPrimaryHover: '#DDF31A',
                colorPrimary: '#DDF31A',
              },
              TimePicker: {
                colorBgContainer: 'rgba(255, 255, 255, 0.05)',
                colorBorder: 'rgba(255, 255, 255, 0.1)',
                colorText: 'white',
                colorTextPlaceholder: 'rgba(255, 255, 255, 0.5)',
                controlOutline: 'rgba(221, 243, 26, 0.2)',
                colorPrimaryHover: '#DDF31A',
                colorPrimary: '#DDF31A',
                colorError: 'rgba(255, 255, 255, 0.1)',
                colorErrorBorder: 'rgba(255, 255, 255, 0.1)',
                colorErrorOutline: 'rgba(255, 255, 255, 0.1)',
              },
              Button: {
                colorPrimary: "#DDF31A",
                colorPrimaryHover: "rgba(221, 243, 26, 0.9)",
              },
              Form: {
                colorError: "#DDF31A",
                colorErrorText: "#DDF31A",
                colorErrorOutline: "#DDF31A",
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
              label={<span className="text-white/90 text-sm font-bold uppercase tracking-wider">{t('club')}</span>}
              name="club"
              rules={[{ required: true, message: t('selectClub') }]}
              required={false}
            >
              <Select
                size="large"
                placeholder={t('selectClub')}
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
                className="[&_.ant-select-selector]:!bg-white/5 [&_.ant-select-selector]:!border-white/10 [&_.ant-select-selector]:!rounded-[7px] [&_.ant-select-selection-placeholder]:!text-white/50 [&_.ant-select-selection-item]:!text-white [&_.ant-select-selector]:focus:!border-[#DDF31A] [&_.ant-select-focused_.ant-select-selector]:!border-[#DDF31A] [&_.ant-select-focused_.ant-select-selector]:!shadow-[0_0_0_1px_#DDF31A]"
                dropdownStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px'
                }}
              />
            </Form.Item>

            {/* Court Selection */}
            <Form.Item
              label={<span className="text-white/90 text-sm font-bold uppercase tracking-wider">{t('court')}</span>}
              name="court"
              rules={[{ required: true, message: t('selectCourt') }]}
              required={false}
            >
              <Select
                size="large"
                placeholder={t('selectCourt')}
                onChange={setSelectedCourt}
                options={courts.map((court) => ({ label: `Court ${court}`, value: court }))}
                disabled={!selectedClubId}
                className="[&_.ant-select-selector]:!bg-white/5 [&_.ant-select-selector]:!border-white/10 [&_.ant-select-selector]:!rounded-[7px] [&_.ant-select-selection-placeholder]:!text-white/50 [&_.ant-select-selection-item]:!text-white [&_.ant-select-selector]:focus:!border-[#DDF31A] [&_.ant-select-focused_.ant-select-selector]:!border-[#DDF31A] [&_.ant-select-focused_.ant-select-selector]:!shadow-[0_0_0_1px_#DDF31A]"
                dropdownStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px'
                }}
              />
            </Form.Item>

            {/* Date Selection */}
            <Form.Item
              label={<span className="text-white/90 text-sm font-bold uppercase tracking-wider">{t('date')}</span>}
              name="date"
              rules={[{ required: true, message: t('selectDate') }]}
              required={false}
            >
              <DatePicker
                size="large"
                style={{ width: '100%' }}
                value={selectedDate}
                minDate={dayjs(lastWeekString, dateFormat)}
                maxDate={dayjs(todayString, dateFormat)}
                onChange={(date) => date && setSelectedDate(date)}
                allowClear={false}
                className="[&_.ant-picker]:!bg-white/5 [&_.ant-picker]:!border-white/10 [&_.ant-picker]:!rounded-[12px] [&_.ant-picker-input>input]:!text-white [&_.ant-picker-input>input::placeholder]:!text-white/50 [&_.ant-picker]:focus:!border-[#DDF31A] [&_.ant-picker-focused]:!border-[#DDF31A] [&_.ant-picker-focused]:!shadow-[0_0_0_1px_#DDF31A]"
              />
            </Form.Item>

            {/* Time Selection */}
            <Form.Item
              label={<span className="text-white/90 text-sm font-bold uppercase tracking-wider">{t('time')}</span>}
              name="time"
              rules={[{ required: true, message: t('selectTime') }]}
              required={false}
            >
              <TimePicker
                size="large"
                style={{ width: '100%' }}
                use12Hours
                format="h:mm a"
                minuteStep={30}
                onChange={handleTimeSelect}
                className="[&_.ant-picker]:!bg-white/5 [&_.ant-picker]:!border-white/10 [&_.ant-picker]:!rounded-[12px] [&_.ant-picker-input>input]:!text-white [&_.ant-picker-input>input::placeholder]:!text-white/50 [&_.ant-picker]:focus:!border-[#DDF31A] [&_.ant-picker-focused]:!border-[#DDF31A] [&_.ant-picker-focused]:!shadow-[0_0_0_1px_#DDF31A] [&_.ant-picker-status-error]:!border-white/10 [&_.ant-picker-status-error]:!shadow-none [&_.ant-picker-status-error.ant-picker-focused]:!border-[#DDF31A] [&_.ant-picker-status-error.ant-picker-focused]:!shadow-[0_0_0_1px_#DDF31A] [&_.ant-form-item-has-error_.ant-picker]:!border-white/10 [&_.ant-form-item-has-error_.ant-picker]:!shadow-none"
                popupClassName="[&_.ant-picker-dropdown]:!bg-white/5 [&_.ant-picker-dropdown]:!backdrop-blur-[10px] [&_.ant-picker-dropdown]:!border-white/10 [&_.ant-picker-dropdown]:!rounded-xl"
              />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item className="mb-0 pt-4">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                className="w-full h-12 bg-gradient-to-r from-[#acbb22] to-[#B8E016] hover:from-[#c9de17] hover:to-[#a3c614] border-none text-black font-semibold rounded-xl  hover:shadow-[0_6px_20px_0_rgba(221,243,26,0.6)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('searching')}
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      {t('findMyGame')}
                    </>
                  )}
                </span>
              </Button>
            </Form.Item>
          </Form>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default BlurredContainer;