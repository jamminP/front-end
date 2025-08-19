import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import CommunityLayout from './community/CommunityLayout';
import Header from './header/Header';
import MyPage from './mypage/Mypage';
import MypageContent from './mypage/components/MypageContent';
import Challenge from './mypage/components/Challenge';
import Login from './login/Login';
import MyCalendar from './mypage/components/Calendar';
import LandingPage from '@landing/LandingPage';
import CommunityAll from './community/category/CommunityAll';
import Footer from './footer/Footer';
import CreatePost from './community/form/CreatePost';
import CommunityFree from './community/category/CommunityFree';
import CommunityShare from './community/category/CommunityShare';
import AiPage from './ai/AiPage';
import EditPost from './community/form/EditPost';
import PostDetail from './community/post/components/CommentItem';
import CommunityStudy from './community/category/CommunityStudy';
import PostDetailMock from './community/post/PostDetail';
import { useEffect, useState } from 'react';
import useAuthStore from './store/authStore';
import axios from 'axios';
import Cookies from 'js-cookie';

function useCookie(key: string) {
  const [value, setValue] = useState(Cookies.get(key) || null);

  useEffect(() => {
    const interval = setInterval(() => {
      const cookie = Cookies.get(key) || null;
      if (cookie !== value) setValue(cookie); // 쿠키가 바뀌면 상태 업데이트
    }, 500);
    return () => clearInterval(interval);
  }, [value, key]);

  return value;
}

function AppContent() {
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const logout = useAuthStore((state) => state.logout);

  // 쿠키를 감지
  const accessToken = useCookie('access_token');

  const checkLogin = async () => {
    try {
      if (!accessToken) return;

      const res = await axios.get('https://backend.evida.site/api/v1/users/myinfo', {
        withCredentials: true,
      });
      setAuthData(res.data);
    } catch {
      logout();
    }
  };

  // access_token이 생기거나 바뀌면 체크
  useEffect(() => {
    checkLogin();
  }, [accessToken]);

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
            <Route path="/community/:category/:id" element={<PostDetailMock />} />
            <Route path="/community/:category/:id/edit" element={<EditPost />} />
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
      <Footer />
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
