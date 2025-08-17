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

function App() {
  const setAuthData = useAuthStore((state) => state.setAuthData);

  useEffect(() => {
    // 테스트용: 직접 복사한 JWT를 넣어 로그인 상태 확인
    const accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNyIsImV4cCI6MTc1NTM5NDU5NH0.doRwyO9Londh-3URXWzY0A9y-0j2zx_wEH8fegTxCJ4';

    fetch('https://backend.evida.site/api/v1/users/myinfo', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`, // 여기!
      },
    })
      .then(async (res) => {
        const text = await res.text();
        console.log('status:', res.status);
        console.log('body:', text);
        if (!res.ok) throw new Error(`실패: ${res.status}`);
        return JSON.parse(text);
      })
      .then((user) => {
        console.log('user:', user);
        setAuthData({ user });
      })
      .catch((err) => console.log(err.message));
  }, [setAuthData]);

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
