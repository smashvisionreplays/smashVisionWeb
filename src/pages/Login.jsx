import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../../components/LanguageSelector';

const Login = () => {
  const { isSignedIn } = useAuth();
  const { t } = useLanguage();
  const [isSignUp, setIsSignUp] = useState(false);

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const clerkAppearance = {
    variables: {
      colorText: '#ffffff',
      colorTextSecondary: 'rgba(255,255,255,0.75)',
      colorInputText: '#ffffff',
      colorInputBackground: 'rgba(255,255,255,0.08)',
      colorBackground: 'transparent',
      colorPrimary: '#DDF31A',
    },
    elements: {
      rootBox: 'w-full',
      card: 'bg-transparent shadow-none p-1 border-none',
      cardBox: 'bg-transparent shadow-none border-none',
      header: 'text-center',
      headerTitle: 'hidden',
      headerSubtitle: 'hidden',
      footer: 'hidden',
      footerAction: 'hidden',
      main: 'gap-6',
      form: 'gap-4',
      socialButtonsBlockButton:
        'bg-white/95 border-none text-gray-700 hover:bg-white transition-all rounded-lg py-3 font-medium',
      socialButtonsBlockButtonText: 'text-gray-700 font-medium',
      dividerLine: 'bg-white/30',
      dividerText: 'text-white/60 text-sm',
      dividerRow: 'my-4',
      formFieldLabel: 'text-white/90 font-medium text-sm mb-1',
      formFieldInput:
        'bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30 rounded-lg py-3 px-4 w-full backdrop-blur-sm',
      formFieldInputShowPasswordButton: 'text-black/60 hover:text-black hover:bg-gray-300',
      formButtonPrimary:
        'bg-[#DDF31A] hover:bg-gray-700 text-black font-medium rounded-lg py-3 w-full transition-all mt-2',
      formFieldAction: 'text-orange-400 hover:text-orange-300 text-sm',
      formFieldErrorText: 'text-red-400 text-sm mt-1',
      alert: 'bg-red-500/20 border border-red-500/30 text-white rounded-lg p-3',
      otpCodeFieldInput: 'text-white bg-white/10 border border-white/20',
      identityPreviewText: 'text-white',
      identityPreviewEditButton: 'text-white/70 hover:text-white',
      formResendCodeLink: "text-white hover:text-white/80 flex flex-col items-center gap-2 before:content-[var(--otp-spam-note)] before:text-white/40 before:text-xs before:font-normal before:cursor-default before:[text-decoration:none] before:pointer-events-none",
      formHeaderSubtitle: 'text-white/80',
    },
    layout: {
      socialButtonsPlacement: 'top',
      socialButtonsVariant: 'blockButton',
    },
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div
        className="w-full max-w-md backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl h-min py-8 px-6 flex flex-col"
        style={{ '--otp-spam-note': `"${t('otpSpamNoteCss')}"` }}
      >
        <h1 className="text-2xl font-bold text-white mb-1">
          {isSignUp ? t('signUp') : t('signIn')}
        </h1>
        <p className="text-white/50 text-sm mb-6">
          {isSignUp ? t('signUpBoxSubtitle') : t('signInBoxSubtitle')}
        </p>
        <div className="">
          {isSignUp ? (
            <SignUp
              appearance={clerkAppearance}
              afterSignUpUrl="/dashboard"
            />
          ) : (
            <SignIn
              appearance={clerkAppearance}
              afterSignInUrl="/dashboard"
            />
          )}
        </div>
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-center gap-2">
          <span className="text-white/40 text-sm">
            {isSignUp ? t('haveAccount') : t('noAccount')}
          </span>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#DDF31A] hover:text-white text-sm font-medium transition-colors"
          >
            {isSignUp ? t('signIn') : t('signUp')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;