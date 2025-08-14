// authStore.ts
import { create } from 'zustand';

// 유저 타입
interface User {
  id: number;
  email: string;
  nickname: string;
  provider: string;
  is_superuser: boolean;
}

// Zustand 상태 타입
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  setAuthData: (data: { user: User; accessToken: string }) => void;
  logout: () => void;
}

// Zustand 스토어
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoggedIn: false,
  setAuthData: ({ user, accessToken }) =>
    set({
      user,
      accessToken,
      isLoggedIn: true,
    }),
  logout: () =>
    set({
      user: null,
      accessToken: null,
      isLoggedIn: false,
    }),
}));

export default useAuthStore;
