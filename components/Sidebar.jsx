import { useEffect } from 'react';
import { initFlowbite } from "flowbite";
import { TabGroup, TabList, Tab } from '@headlessui/react';
import { useAuth, useUser, UserButton } from '@clerk/clerk-react'
import { useLanguage } from '../src/contexts/LanguageContext';

export default function Sidebar({ onSelect, userRole = 'member' }) {
  const { t } = useLanguage();
  const { user } = useUser();
  const userName = user?.fullName || user?.firstName || user?.username || '';
  
  useEffect(() => {
    initFlowbite();
  }, []);

  const getAllCategories = () => [
    { name: 'Clips', label: t('myClips'), roles: ['member', 'club'], icon: '/clips.svg' },
    { name: 'Videos', label: 'Videos', roles: ['club'], icon: '/videocam.svg' },
    { name: 'Lives', label: t('lives'), roles: ['club'], icon: '/live_tv.svg' },
    { name: 'Statistics', label: t('statistics'), roles: ['club'], icon: '/statistics.svg' },
  ];

  const allCategories = getAllCategories();

  const categories = allCategories.filter(category => 
    category.roles.includes(userRole)
  );

  return (
    <div className="relative">
      <aside className="max-sm:hidden mt-14 lg:mt-0 w-72 h-screen transition-all duration-300 ease-in-out">
        <div className="h-full backdrop-blur-xl bg-white/[0.03] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Top shimmer line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#acbb22]/30 to-transparent pointer-events-none z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 h-full px-6 py-8 flex flex-col">
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: "bg-white/95 backdrop-blur-sm border border-white/20"
                    }
                  }}
                />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#B8E016] rounded-full border-2 border-[#05070B] shadow-[0_0_8px_rgba(184,224,22,0.5)]"></div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white/90">
                    {userName}
                  </span>
                  <span className="text-sm text-white/60 font-medium capitalize">
                    {userRole === 'club' ? t('clubAccount') : t('memberAccount')}
                  </span>
                </div>
              </div>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <TabGroup className="flex flex-col space-y-3">
                <TabList className="flex flex-col space-y-3">
                  {categories.map(({ name, label, icon }) => (
                    <Tab
                      key={name}
                      className="group relative rounded-2xl py-3.5 px-5 text-left font-medium text-white/50
                                focus:outline-none transition-all duration-300 ease-in-out
                                data-[selected]:text-white data-[selected]:shadow-md"
                      onClick={() => onSelect(name)}
                    >
                      <div className="flex items-center space-x-3 relative z-10">
                        <img
                          src={icon}
                          alt={label}
                          className="w-5 h-5 opacity-40 group-data-[selected]:opacity-100 transition-opacity duration-300"
                          style={{ filter: 'brightness(0) invert(1)' }}
                        />
                        <span className="text-sm">{label}</span>
                      </div>

                      {/* Brand accent left bar */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-gradient-to-b from-[#acbb22] to-[#B8E016] opacity-0 group-data-[selected]:opacity-100 transition-opacity duration-300"></div>

                      {/* Selected: brand gradient background */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#acbb22]/15 to-[#B8E016]/5 border border-[#acbb22]/20 opacity-0 group-data-[selected]:opacity-100 transition-all duration-300 pointer-events-none"></div>

                      {/* Hover background (hidden when selected) */}
                      <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 group-data-[selected]:opacity-0 transition-opacity duration-300 pointer-events-none"></div>
                    </Tab>
                  ))}
                </TabList>
              </TabGroup>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.07]">
              <div className="text-center">
                <p className="text-xs font-semibold tracking-widest uppercase">
                  <span className="text-[#acbb22]/50">Smash</span><span className="text-[#B8E016]/50">Vision</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}