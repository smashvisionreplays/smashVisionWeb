import DashboardContent from "../../components/dashboard/DashboardContent";
import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import { Tab, TabGroup, TabList } from '@headlessui/react';
import { useUser } from '@clerk/clerk-react';
import { fetchUserMetadata } from '../controllers/userController';
import { useLanguage } from '../contexts/LanguageContext';
import VideoModal from "../../components/VideoModal";

export default function Dashboard({ triggerNotification }) {
  const { user } = useUser();
  const { t } = useLanguage();
  const [userMetadata, setUserMetadata] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCategories = () => [
    { name: 'Clips', label: t('myClips') },
    { name: 'Videos', label: 'Videos' },
    { name: 'Lives', label: t('lives') },
    { name: 'Statistics', label: t('statistics') },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [selectedButton, setSelectedButton] = useState('Clips');

  // Fetch user metadata including private data
  useEffect(() => {
    const loadUserMetadata = async () => {
      if (user?.id) {
        try {
          const metadata = await fetchUserMetadata(user.id);
          setUserMetadata(metadata);
        } catch (error) {
          console.error('Failed to load user metadata:', error);
          triggerNotification?.('error', 'Failed to load user data');
        } finally {
          setLoading(false);
        }
      }
    };

    loadUserMetadata();
  }, [user?.id]);

  const showModal = (videoData) => {
    setVideoData(videoData);
    setIsModalOpen(true);
  };

  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);
  const handleSelect = (button) => setSelectedButton(button);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-4 w-12 h-12">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#acbb22]/20 border-t-[#B8E016]"></div>
          </div>
          <p className="text-white/40 text-sm font-medium tracking-wide">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!userMetadata?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white/90 mb-4">Account Setup Required</h2>
          <p className="text-white/60">Please contact support to complete your account setup.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <VideoModal 
        videoData={videoData} 
        isModalOpen={isModalOpen} 
        handleOk={handleOk} 
        handleCancel={handleCancel} 
      />
      
      <div className="min-h-screen flex items-center justify-center" style={{marginTop:'6rem'}}>
        <div className="w-full lg:w-10/12 xl:w-8/12 m-auto lg:flex min-h-screen">
          {/* Mobile Tab Navigation */}
          <div className="sm:hidden flex justify-center px-4 pt-4 pb-2">
            <div className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 p-1.5 w-full max-w-sm shadow-xl">
              <TabGroup>
                <TabList className="flex gap-1">
                  {getCategories().map(({ name, label }) => (
                    <Tab
                      key={name}
                      className="group relative flex-1 rounded-xl py-2 px-2 text-xs font-semibold text-white/50
                                focus:outline-none transition-all duration-200 ease-in-out
                                data-[selected]:text-white data-[selected]:shadow-md
                                data-[hover]:text-white/80"
                      onClick={() => handleSelect(name)}
                    >
                      <span className="relative z-10">{label}</span>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#acbb22]/20 to-[#B8E016]/10 border border-[#acbb22]/20 opacity-0 group-data-[selected]:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                    </Tab>
                  ))}
                </TabList>
              </TabGroup>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:mr-6">
            <Sidebar onSelect={handleSelect} userRole={userMetadata.role} />
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 lg:p-6">
            <div className="relative backdrop-blur-xl bg-white/[0.03] rounded-3xl border border-white/10 shadow-2xl min-h-[600px] overflow-hidden">
              {/* Top shimmer line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#acbb22]/30 to-transparent pointer-events-none"></div>

              {/* Content Header */}
              <div className="p-6 pb-5 border-b border-white/[0.07] flex items-center gap-4">
                <div className="w-1 h-9 rounded-full bg-gradient-to-b from-[#acbb22] to-[#B8E016] flex-shrink-0 shadow-[0_0_8px_rgba(172,187,34,0.4)]"></div>
                <div>
                  <h1 className="text-xl font-bold text-white/90 leading-tight">
                    {getCategories().find(cat => cat.name === selectedButton)?.label || selectedButton}
                  </h1>
                  <p className="text-white/35 text-xs mt-0.5 font-light">
                    {t('descriptionPanel')} {selectedButton.toLowerCase()}
                  </p>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6">
                <DashboardContent
                  selectedButton={selectedButton}
                  userRole={userMetadata.role}
                  userId={userMetadata.id}
                  renderModal={showModal}
                  triggerNotification={triggerNotification}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}