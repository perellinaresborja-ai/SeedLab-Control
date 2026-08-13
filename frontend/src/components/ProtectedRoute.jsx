import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute() {
  const { currentUser, authLoading } = useAppContext();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-cyan animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
