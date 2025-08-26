import { create } from 'zustand';

// 유저 타입
interface User {
  id: number;
  email: string;
  nickname: string;
  profile_image: string;
}

// 스토어 상태 타입
interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setAuthData: (user: User) => void;
  logout: () => void;
  finishLoading: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  setAuthData: (user) =>
    set({
      user,
      isLoggedIn: true,
      isLoading: false,
    }),
  logout: () =>
    set({
      user: null,
      isLoggedIn: false,
      isLoading: false,
    }),
  finishLoading: () => set({ isLoading: false }),
}));

export default useAuthStore;
