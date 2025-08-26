import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from './store/authStore';

export default function ProtectedRoute() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const location = useLocation();
  if (!isLoggedIn) {
    if (location.pathname !== '/') {
      return <Navigate to="/login" replace />;
    }
  }
  return <Outlet />;
}
