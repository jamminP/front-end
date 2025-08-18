// stores/authStore.ts
import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  nickname: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuthData: (data: { user: User; token: string }) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuthData: (data) => set({ user: data.user, token: data.token }),
  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
