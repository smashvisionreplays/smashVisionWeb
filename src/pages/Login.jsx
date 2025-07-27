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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white/90 mb-4">
            Welcome to SmashVision
          </h1>
          <p className="text-white/60">
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