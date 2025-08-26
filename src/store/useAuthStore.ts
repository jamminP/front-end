import { create } from 'zustand';

export type User = {
  id: number;
  email: string;
  nickname: string;
  profile_image: string;
};

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  setAuthData: (user: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  setAuthData: (user) => set({ user, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false }),
}));

export default useAuthStore;
