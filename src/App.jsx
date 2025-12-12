import { BrowserRouter } from "react-router-dom"
import { ClerkProvider } from '@clerk/clerk-react'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import { WebSocketProvider } from './contexts/WebSocketContext'
import Index from './Index.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder'

const ClerkWithLocalization = ({ children }) => {
  const { language, t } = useLanguage();
  
  // Full localization object for Clerk
  const clerkLocalization = {
    socialButtonsBlockButton: t('continueWith'),
    dividerText: t('or'),
    formFieldLabel__emailAddress: t('emailAddress'),
    formFieldLabel__password: t('password'),
    formButtonPrimary: t('continue'),
    formFieldAction__forgotPassword: t('forgotPassword'),
    signIn: {
      start: {
        title: t('signInTitle'),
        subtitle: t('signInSubtitle'),
        actionText: t('noAccount'),
        actionLink: t('signUp'),
      },
      password: {
        title: t('enterPassword'),
        subtitle: t('enterPasswordSubtitle'),
        actionLink: t('forgotPassword'),
      },
    },
    signUp: {
      start: {
        title: t('signUpTitle'),
        subtitle: t('signUpSubtitle'),
        actionText: t('haveAccount'),
        actionLink: t('signIn'),
      },
    },
  };
  
  return (
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      localization={clerkLocalization}
    >
      {children}
    </ClerkProvider>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <ClerkWithLocalization>
        <WebSocketProvider>
          <BrowserRouter>
            <div className="img-background-container h-screen">
              <Index />
            </div>
          </BrowserRouter>
        </WebSocketProvider>
      </ClerkWithLocalization>
    </LanguageProvider>
  )
}