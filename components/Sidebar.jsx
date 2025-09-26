import { useEffect } from 'react';
import { initFlowbite } from "flowbite";
import { TabGroup, TabList, Tab } from '@headlessui/react';
import { useAuth, useUser, UserButton } from '@clerk/clerk-react'
import { useLanguage } from '../src/contexts/LanguageContext';

export default function Sidebar({ onSelect, userRole = 'member' }) {
  const { t } = useLanguage();
  
  useEffect(() => {
    initFlowbite();
  }, []);

  const getAllCategories = () => [
    { name: 'Clips', label: t('myClips'), roles: ['member', 'club'] },
    { name: 'Videos', label: 'Videos', roles: ['club'] },
    { name: 'Lives', label: t('lives'), roles: ['club'] },
    { name: 'Statistics', label: t('statistics'), roles: ['club'] },
  ];

  const allCategories = getAllCategories();

  const categories = allCategories.filter(category => 
    category.roles.includes(userRole)
  );

  return (
    <div className="relative">
      <aside className="max-sm:hidden mt-14 lg:mt-0 w-72 h-screen transition-all duration-300 ease-in-out">
        <div className="h-full backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
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
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white/20"></div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white/90">
                    {userRole === 'club' ? t('clubDashboard') : t('memberDashboard')}
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
                  {categories.map(({ name, label }) => (
                    <Tab
                      key={name}
                      className="group relative rounded-2xl py-4 px-6 text-left font-semibold text-white/80 
                                focus:outline-none transition-all duration-300 ease-in-out
                                data-[selected]:bg-white/15 data-[selected]:backdrop-blur-sm 
                                data-[selected]:shadow-lg data-[selected]:text-white
                                data-[hover]:bg-white/10 data-[hover]:text-white/90
                                data-[selected]:data-[hover]:bg-white/20"
                      onClick={() => onSelect(name)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-current opacity-60 group-data-[selected]:opacity-100 transition-opacity"></div>
                        <span className="text-base">{label}</span>
                      </div>
                      
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Tab>
                  ))}
                </TabList>
              </TabGroup>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-xs text-white/40">
                  SmashVision Dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}