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
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import axios from 'axios';

function App() {
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    // 1) 쿠키에서 access_token 추출
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1];

    if (!token) {
      logout();
      return;
    }

    // 2) Authorization 헤더로 myinfo 호출
    axios
      .get('https://backend.evida.site/api/v1/users/myinfo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setAuthData(res.data))
      .catch(() => logout());
  }, [setAuthData, logout]);

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
