import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="relative mx-auto mb-4 w-12 h-12">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#acbb22]/20 border-t-[#B8E016]"></div>
          </div>
          <p className="text-white/40 text-sm font-medium tracking-wide">Loading…</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;