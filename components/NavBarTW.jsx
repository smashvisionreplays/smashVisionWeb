import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, useLocation } from 'react-router-dom'
import { useAuth, useUser, UserButton } from '@clerk/clerk-react'
import { useLanguage } from '../src/contexts/LanguageContext'
import LanguageSelector from './LanguageSelector'

const getNavigation = (t) => [
  { name: t('dashboard'), to: '/dashboard', current: false },
  { name: t('lives'), to: '/lives', current: false },
  // { name: t('tournaments'), to: '/tournaments', current: false }, Uncomment when tournaments page is ready
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function NavBar() {
  const location = useLocation();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { t } = useLanguage();

  const navigation = getNavigation(t);

  return (
    <Disclosure as="nav" className="fixed top-0 left-0 right-0 z-50">
      {({ close }) => (
        /* Single unified blur container — covers both the navbar row and the mobile dropdown */
        <div className="bg-gradient-to-b from-black/50 via-black/30 to-transparent backdrop-blur-sm">
        <div className="mx-auto w-full max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">

            <div className="flex flex-1 items-center sm:items-stretch justify-around">
              <div className="inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/10 hover:text-white focus:outline-none">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
                  <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
                </DisclosureButton>
              </div>

              <div className="flex shrink-0 items-center align-bottom">
                <Link to="/" className="flex items-center space-x-3 group">
                  <img
                    alt="SmashVision"
                    src="./word-logo.png"
                    className="h-8 w-auto transition-transform group-hover:scale-105"
                  />
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
                        isActive ? 'bg-white/20 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
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
                    className="bg-gradient-to-r from-[#acbb22] to-[#B8E016] hover:from-[#c9de17] hover:to-[#a3c614] text-black px-4 py-2 rounded-lg  transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group shadow-lg"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative z-10">Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* No separate backdrop-blur — shares the parent's blur region seamlessly */}
        <DisclosurePanel className="sm:hidden transition-all duration-300 ease-in-out">
          <div className="space-y-1 px-2 pb-3 pt-2 text-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                onClick={() => close()}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current ? 'bg-white/20 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white',
                  'block rounded-md px-3 py-2 text-base max-sm:text-xs font-medium mx-auto max-w-xs transition-all duration-200',
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex justify-center py-2">
              <LanguageSelector />
            </div>
          </div>
        </DisclosurePanel>
        </div>
      )}
    </Disclosure>
  )
}
