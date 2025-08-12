import { create } from 'zustand';

//유저 타입
interface User {
  id: number;
  email: string;
  nickname: string;
  provider: string;
  is_superuser: boolean;
}

//스토어 상태 타입
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  setAuthData: (data: { user: User; accessToken: string; refreshToken: string }) => void;
  logout: () => void;
}

//zustand스토어
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
  setAuthData: ({ user, accessToken, refreshToken }) =>
    set({
      user,
      accessToken,
      refreshToken,
      isLoggedIn: true,
    }),
  logout: () =>
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
    }),
}));

export default useAuthStore;
