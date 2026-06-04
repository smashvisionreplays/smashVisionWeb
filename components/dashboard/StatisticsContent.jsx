import { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
import { fetchStatistics, fetchUserEmailsByIds } from '../../src/controllers/statisticsController';
import { useAuth } from '@clerk/clerk-react';
import { useLanguage } from '../../src/contexts/LanguageContext';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
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

  const downloadClipsExcel = async () => {
    const authToken = await getToken();
    const userIds = [...new Set(statisticsData.clips.map(c => c.id_user).filter(Boolean))];
    let emailMap = {};
    if (userIds.length > 0) {
      emailMap = await fetchUserEmailsByIds(userIds, authToken);
    }

    const rows = statisticsData.clips.map((clip) => {
      const createdDate = clip._createddate
        ? dayjs(clip._createddate).format('YYYY-MM-DD HH:mm:ss')
        : '';
      const userEmail = clip.id_user == null ? 'Club' : (emailMap[clip.id_user] || clip.id_user);

      return {
        'Created Date': createdDate,
        'Clip Name': clip.clip_name || '',
        'Weekday': clip.weekday || '',
        'Tag': clip.tag || '',
        'User': userEmail,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clips History');

    const startLabel = dateRange[0].format('YYYY-MM-DD');
    const endLabel = dateRange[1].format('YYYY-MM-DD');
    XLSX.writeFile(workbook, `clips_history_${startLabel}_${endLabel}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#acbb22]/20 border-t-[#B8E016]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Range Picker */}
      <div className="relative backdrop-blur-sm bg-white/2 rounded-2xl border border-white/10 overflow-hidden p-4">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#acbb22]/25 to-transparent pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white/70">{t('selectDateRange')}</h3>
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
        <div className="relative backdrop-blur-sm bg-white/2 rounded-2xl border border-white/10 overflow-hidden p-6">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B8E016]/30 to-transparent pointer-events-none"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">{t('clipsGenerated')}</h3>
            {statisticsData.clips?.length > 0 && (
              <button
                onClick={downloadClipsExcel}
                className="flex items-center gap-1.5 text-xs font-medium text-[#B8E016] border border-[#B8E016]/30 hover:border-[#B8E016]/60 hover:bg-[#B8E016]/10 px-3 py-1.5 rounded-lg transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Excel
              </button>
            )}
          </div>
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-[#B8E016] mb-1 drop-shadow-[0_0_12px_rgba(184,224,22,0.3)]">
              {statisticsData.clips?.length || 0}
            </div>
            <p className="text-white/35 text-xs">{t('totalClips')}</p>
          </div>
          {statisticsData.clips?.length > 0 && (
            <div className="mt-4 space-y-1.5 max-h-40 overflow-y-auto">
              {statisticsData.clips.slice(0, 5).map((clip, index) => (
                <div key={index} className="text-xs text-white/50 px-3 py-2 bg-white/5 rounded-xl border border-white/5">
                  {clip.clip_name || `Clip ${index + 1}`}
                </div>
              ))}
              {statisticsData.clips.length > 5 && (
                <div className="text-xs text-white/30 text-center py-1">
                  +{statisticsData.clips.length - 5} more
                </div>
              )}
            </div>
          )}
        </div>

        {/* Best Points Statistics */}
        <div className="relative backdrop-blur-sm bg-white/2 rounded-2xl border border-white/10 overflow-hidden p-6">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#acbb22]/30 to-transparent pointer-events-none"></div>
          <h3 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider">{t('bestPointsGenerated')}</h3>
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-[#acbb22] mb-1 drop-shadow-[0_0_12px_rgba(172,187,34,0.3)]">
              {statisticsData.bestPoints?.length || 0}
            </div>
            <p className="text-white/35 text-xs">{t('totalBestPoints')}</p>
          </div>
          {statisticsData.bestPoints?.length > 0 && (
            <div className="mt-4 space-y-1.5 max-h-40 overflow-y-auto">
              {statisticsData.bestPoints.slice(0, 5).map((point, index) => (
                <div key={index} className="text-xs text-white/50 px-3 py-2 bg-white/5 rounded-xl border border-white/5">
                  {point.Point_Name || `Best Point ${index + 1}`}
                </div>
              ))}
              {statisticsData.bestPoints.length > 5 && (
                <div className="text-xs text-white/30 text-center py-1">
                  +{statisticsData.bestPoints.length - 5} more
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