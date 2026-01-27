import { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import { fetchStatistics } from '../../src/controllers/statisticsController';
import { useAuth } from '@clerk/clerk-react';
import { useLanguage } from '../../src/contexts/LanguageContext';
import dayjs from 'dayjs';
import '../../stylesheet/rangepicker.css';

const { RangePicker } = DatePicker;

const StatisticsContent = ({ userId }) => {
  const { getToken } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, 'days'),
    dayjs()
  ]);
  const [statisticsData, setStatisticsData] = useState({
    clips: [],
    bestPoints: []
  });

  const loadStatistics = async () => {
    if (!dateRange || dateRange.length !== 2) return;
    
    setLoading(true);
    try {
      const authToken = await getToken();
      const startDate = dateRange[0].format('YYYY-MM-DD HH:mm:ss');
      const endDate = dateRange[1].format('YYYY-MM-DD HH:mm:ss');
      
      const data = await fetchStatistics(userId, startDate, endDate, authToken);
      setStatisticsData(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && dateRange) {
      loadStatistics();
    }
  }, [userId, dateRange]);

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/60"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Range Picker */}
      <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white/90">{t('selectDateRange')}</h3>
          <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            format="YYYY-MM-DD"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}
            className="w-full sm:w-auto"
            dropdownClassName="mobile-rangepicker"
          />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Clips Statistics */}
        <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-6">
          <h3 className="text-xl font-semibold text-white/90 mb-4">{t('clipsGenerated')}</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">
              {statisticsData.clips?.length || 0}
            </div>
            <p className="text-white/60">{t('totalClips')}</p>
          </div>
          {statisticsData.clips?.length > 0 && (
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
              {statisticsData.clips.slice(0, 5).map((clip, index) => (
                <div key={index} className="text-sm text-white/70 p-2 bg-white/5 rounded">
                  {clip.Clip_Name || `Clip ${index + 1}`}
                </div>
              ))}
              {statisticsData.clips.length > 5 && (
                <div className="text-sm text-white/50 text-center">
                  +{statisticsData.clips.length - 5} more clips
                </div>
              )}
            </div>
          )}
        </div>

        {/* Best Points Statistics */}
        <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 p-6">
          <h3 className="text-xl font-semibold text-white/90 mb-4">{t('bestPointsGenerated')}</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">
              {statisticsData.bestPoints?.length || 0}
            </div>
            <p className="text-white/60">{t('totalBestPoints')}</p>
          </div>
          {statisticsData.bestPoints?.length > 0 && (
            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
              {statisticsData.bestPoints.slice(0, 5).map((point, index) => (
                <div key={index} className="text-sm text-white/70 p-2 bg-white/5 rounded">
                  {point.Point_Name || `Best Point ${index + 1}`}
                </div>
              ))}
              {statisticsData.bestPoints.length > 5 && (
                <div className="text-sm text-white/50 text-center">
                  +{statisticsData.bestPoints.length - 5} more points
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsContent;