import { SignIn, useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { isSignedIn } = useAuth();

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
            Sign in to access your account and manage your padel content
          </p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white/95 backdrop-blur-sm border border-white/20 shadow-xl",
            }
          }}
        />
      </div>
    </div>
  );
};

export default Login;
    