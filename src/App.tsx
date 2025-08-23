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
import { useCallback, useEffect, useState } from 'react';
import useAuthStore from './store/authStore';
import axios from 'axios';

function AppContent() {
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const logout = useAuthStore((state) => state.logout);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!window.opener) return;
      try {
        const res = await axios.get('https://backend.evida.site/api/v1/users/myinfo', {
          withCredentials: true,
        });
        //부모창에 전달
        window.opener.postMessage({ user: res.data }, 'https://eunbin.evida.site');
        window.close();
      } catch (err) {
        console.error('사용자 정보 불러오기 실패', err);
      }
    };
    fetchUser();
  }, []);

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
