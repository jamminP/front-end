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

  const fetchMyInfo = async () => {
    try {
      const res = await axios.get('https://backend.evida.site/api/v1/users/myinfo', {
        withCredentials: true, // 쿠키 자동 전송
      });
      setAuthData(res.data);
    } catch (err) {
      logout();
    }
  };

  useEffect(() => {
    // 페이지 로드될 때마다 로그인 상태 확인
    fetchMyInfo();

    // 혹은 구글 로그인 후 돌아왔을 때 강제 갱신용
    const handleFocus = () => fetchMyInfo();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

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
