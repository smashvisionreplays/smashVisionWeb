import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';

const Login = () => {
  const { isSignedIn } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex justify-center sm:items-center p-4">
      <div className="sm:backdrop-blur-xl sm:bg-white/10 sm:rounded-3xl sm:border sm:border-white/20 sm:shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="hidden text-3xl font-bold text-white/90 mb-4 sm:block">
            Welcome to SmashVision
          </h1>
          <p className="hidden sm:block text-white/60">
            {isSignUp ? 'Create your account' : 'Sign in to access your account'} and manage your padel content
          </p>
        </div>
        
        {isSignUp ? (
          <SignUp 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-white/95 backdrop-blur-sm border border-white/20 shadow-xl",
              }
            }}
            afterSignUpUrl="/dashboard"
          />
        ) : (
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-white/95 backdrop-blur-sm border border-white/20 shadow-xl",
              }
            }}
            afterSignInUrl="/dashboard"
          />
        )}
        
        <div className="text-center mt-6">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-white/70 hover:text-white underline"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;