import { create } from 'zustand';

// 유저 타입
interface User {
  id: number;
  email: string;
  nickname: string;
}

// 스토어 상태 타입
interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  setAuthData: (data: { user: User; token: string }) => void;
  logout: () => void;
}

// Zustand 스토어
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  setAuthData: ({ user, token }) =>
    set({
      user,
      token,
      isLoggedIn: true,
    }),
  logout: () =>
    set({
      user: null,
      token: null,
      isLoggedIn: false,
    }),
}));

export default useAuthStore;
