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
  isLoggedIn: boolean;
  isInitialized: boolean;
  setAuthData: (user: User) => void;
  logout: () => void;
  setInitialized: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isInitialized: false,
  setAuthData: (user) =>
    set({
      user,
      isLoggedIn: true,
      isInitialized: true,
    }),
  logout: () =>
    set({
      user: null,
      isLoggedIn: false,
    }),
  setInitialized: () => set({ isInitialized: true }),
}));

export default useAuthStore;
