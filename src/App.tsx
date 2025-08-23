import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import 'react-datepicker/dist/react-datepicker.css';
import CommunityLayout from './community/CommunityLayout';
import Header from './header/Header';
import MyPage from './mypage/Mypage';
import MypageContent from './mypage/components/MypageContent';
import Challenge from './mypage/components/Challenge';
import Login from './login/Login';
import MyCalendar from './mypage/components/Calendar';
import LandingPage from '@landing/LandingPage';
import CommunityAll from './community/category/CommunityAll';
import CreatePost from './community/form/CreatePost';
import CommunityFree from './community/category/CommunityFree';
import CommunityShare from './community/category/CommunityShare';
import AiPage from './ai/AiPage';
import CommunityStudy from './community/category/CommunityStudy';
import PostDetail from './community/post/PostDetail';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import axios from 'axios';

function AppContent() {
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  //로컬에서 로그인 상태 복구
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setAuthData(JSON.parse(savedUser));
    }
  }, [setAuthData]);

  //새창
  useEffect(() => {
    const fetchUser = async () => {
      if (!window.opener) return;
      try {
        const res = await axios.get('https://backend.evida.site/api/v1/users/myinfo', {
          withCredentials: true,
        });
        //부모창에 전달
        window.opener.postMessage({ user: res.data }, 'https://eunbin.evida.site'); //배포시 도메인변경
        window.close();
      } catch (err) {
        console.error('사용자 정보 불러오기 실패', err);
      }
    };
    fetchUser();
  }, []);

  //부모창
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://eunbin.evida.site') return;
      if (event.data.user) {
        setAuthData(event.data.user);
        navigate('/');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setAuthData, navigate]);

  // 부모창: axios 인터셉터에서 만료 감지
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      async (err) => {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          try {
            await axios.post(
              'https://backend.evida.site/api/v1/users/auth/refresh',
              {},
              { withCredentials: true },
            );
            return err.config ? axios(err.config) : Promise.reject(err); // 원래 요청 재시도
          } catch {
            logout();
            localStorage.removeItem('user'); // 새로고침 대비
            navigate('/login');
          }
        }
        return Promise.reject(err);
      },
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [logout, navigate]);

  //상태변경시 로컬 업데이트
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/community/create" element={<CreatePost />} />
          <Route path="/community" element={<CommunityLayout />}>
            <Route index element={<CommunityAll />} />
            <Route path="free" element={<CommunityFree />} />
            <Route path="share" element={<CommunityShare />} />
            <Route path="study" element={<CommunityStudy />} />
            <Route path=":category/:id" element={<PostDetail />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<MyPage />}>
            <Route index element={<MypageContent />} />
            <Route path="calendar" element={<MyCalendar />} />
            <Route path="challenge" element={<Challenge />} />
          </Route>
          <Route path="/ai" element={<AiPage />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
