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
    elements: {
      rootBox: 'w-full',
      card: 'bg-transparent shadow-none p-1 border-none',
      cardBox: 'bg-transparent shadow-none border-none',
      header: 'hidden',
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
    },
    layout: {
      socialButtonsPlacement: 'top',
      socialButtonsVariant: 'blockButton',
    },
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl h-min py-8 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white/90 mb-2">
            {t('welcomeToSmashVision')}
          </h1>
          <p className="text-white/60">
            {isSignUp ? t('createAccount') : t('signInToAccount')}
          </p>
        </div>
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
       
        
        <div className="text-center mt-6">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-white/70 hover:text-white underline transition-colors"
          >
            {isSignUp ? t('alreadyHaveAccount') : t('dontHaveAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;