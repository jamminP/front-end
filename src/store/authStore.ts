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
  setAuthData: (user) => {
    // 로그인 성공시 localStorage에 플래그 저장
    localStorage.setItem('hasAuthToken', 'true');
    set({
      user,
      isLoggedIn: true,
      isInitialized: true, // 로그인 성공시 초기화도 완료
    });
  },
  logout: () => {
    // 로그아웃시 localStorage 플래그 제거
    localStorage.removeItem('hasAuthToken');
    set({
      user: null,
      isLoggedIn: false,
      // isInitialized는 그대로 유지 (이미 초기화는 완료된 상태)
    });
  },
  setInitialized: () => set({ isInitialized: true }),
}));

export default useAuthStore;
