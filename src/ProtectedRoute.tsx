import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from './store/authStore';

export default function ProtectedRoute() {
  const { isLoggedIn, isLoading } = useAuthStore();
  const location = useLocation();
  if (isLoading) {
    return <div className="flex items-center justify-center text-[#d4d4d4]">Loading</div>;
  }
  if (!isLoggedIn) {
    if (location.pathname !== '/') {
      return <Navigate to="/login" replace />;
    }
  }
  return <Outlet />;
}
