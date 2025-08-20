import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
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
import EditPost from './community/form/EditPost';
import CommunityStudy from './community/category/CommunityStudy';
import PostDetailMock from './community/post/PostDetail';
import { useCallback, useEffect, useState } from 'react';
import useAuthStore from './store/authStore';
import axios from 'axios';

function AppContent() {
  const location = useLocation();
  const { isInitialized, setAuthData, logout, setInitialized } = useAuthStore();

  const checkLogin = useCallback(async () => {
    try {
      const res = await axios.get('https://backend.evida.site/api/v1/users/myinfo', {
        withCredentials: true,
      });
      setAuthData(res.data); // setAuthData에서 isInitialized도 true로 설정됨
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        // 401은 예상된 상황이므로 조용히 처리
        logout();
      } else {
        // 네트워크 오류 등 예상치 못한 에러만 콘솔에 출력
        console.error('Auth check error:', err);
      }
      // 어떤 경우든 초기화 완료 처리
      setInitialized();
    }
  }, [setAuthData, logout, setInitialized]);

  useEffect(() => {
    if (!isInitialized) {
      if (location.pathname === '/login') {
        // 로그인 페이지는 API 호출 없이 바로 초기화 완료
        setInitialized();
      } else {
        // 다른 페이지들은 로그인 상태 체크
        checkLogin();
      }
    }
  }, [isInitialized, location.pathname, checkLogin, setInitialized]);

  // 초기화가 완료되지 않았으면 로딩 표시
  if (!isInitialized) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
        }}
      >
        Loading...
      </div>
    );
  }

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
