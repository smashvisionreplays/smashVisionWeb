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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/60 mx-auto mb-4"></div>
          <p className="text-white/60">{t('loading')}</p>
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
      
      <div className="min-h-screen">
        <div className="w-full lg:w-10/12 xl:w-8/12 m-auto lg:flex min-h-screen">
          {/* Mobile Tab Navigation */}
          <div className="sm:hidden flex justify-center p-4">
            <div className="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-2">
              <TabGroup>
                <TabList className="flex gap-2">
                  {getCategories().map(({ name, label }) => (
                    <Tab
                      key={name}
                      className="rounded-xl py-2 px-4 text-sm font-semibold text-white/90 focus:outline-none 
                                data-[selected]:bg-white/20 data-[selected]:backdrop-blur-sm data-[selected]:shadow-lg
                                data-[hover]:bg-white/10 data-[selected]:data-[hover]:bg-white/25 
                                transition-all duration-200 ease-in-out"
                      onClick={() => handleSelect(name)}
                    >
                      {label}
                    </Tab>
                  ))
                }
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
            <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl min-h-[600px]">
              {/* Content Header */}
              <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-bold text-white/90 mb-2">
                  {getCategories().find(cat => cat.name === selectedButton)?.label || selectedButton} {t('dashboard')}
                </h1>
                <p className="text-white/60">
                  {t('descriptionPanel')} {selectedButton.toLowerCase()}
                </p>
              </div>

              {/* Dashboard Content */}
              <div className="p-6">
                <DashboardContent 
                  selectedButton={selectedButton} 
                  userRole={userMetadata.role }
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