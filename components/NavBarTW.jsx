import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline' 
import { Link, useLocation } from 'react-router-dom'
import { useAuth, useUser, UserButton } from '@clerk/clerk-react'
import { useLanguage } from '../src/contexts/LanguageContext'
import LanguageSelector from './LanguageSelector'

const getNavigation = (t) => [
  { name: t('dashboard'), to: '/dashboard', current: false },
  { name: t('lives'), to: '/lives', current: false },
  { name: t('tournaments'), to: '/tournaments', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function NavBar() {
  const location = useLocation();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { t, language, setLanguage } = useLanguage();
  
  const navigation = getNavigation(t);
  
  return (
    <Disclosure as="nav" className="m-auto bg-transparent flex flex-col mb-10">
      <div className="mx-auto w-full max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          
          <div className="flex flex-1 items-center sm:items-stretch justify-around">
            <div className="inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />                                                                                                                                                       
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
              </DisclosureButton>
            </div>
            
            <div className="flex shrink-0 items-center align-bottom">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <img
                    alt="SmashVision"
                    src="./logo.webp"
                    className="h-10 w-auto transition-transform group-hover:scale-105"
                  />
                  <div className="absolute -inset-1 bg-white/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <span className="text-lg font-light text-white/90 max-sm:text-sm tracking-wide">
                  SmashVision
                </span>
              </Link>
            </div>
              
            <div className="hidden my-auto sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.to;
                  return(
                  <Link
                    key={item.name}
                    to={item.to}
                    aria-current={isActive ? 'page' : undefined}
                    className={classNames(
                      isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium',
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
              </div>
            </div>
          
            <div className="inset-y-0 right-0 flex items-center gap-3 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="hidden sm:block">
                <LanguageSelector />
              </div>
              {isSignedIn ? (
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: "bg-white/95 backdrop-blur-sm border border-white/20"
                    }
                  }}
                />
              ) : (
                <Link
                  to="/login"
                  className="bg-[#DDF31A] hover:bg-[#c9de17] text-black px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden transition-all duration-300 ease-in-out">
        <div className="space-y-1 px-2 pb-3 pt-2 text-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'block rounded-md px-3 py-2 text-base max-sm:text-xs font-medium mx-auto max-w-xs',
              )}
            >
              {item.name}
            </Link>
          ))}
          <div className="px-3 py-2">
            <div className="flex flex-col items-center space-y-2">
             
              <div className="flex bg-gray-800 rounded-md p-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={classNames(
                    language === 'en' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white',
                    'px-3 py-1 rounded text-sm font-medium transition-colors'
                  )}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('es')}
                  className={classNames(
                    language === 'es' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white',
                    'px-3 py-1 rounded text-sm font-medium transition-colors'
                  )}
                >
                  ES
                </button>
              </div>
            </div>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}