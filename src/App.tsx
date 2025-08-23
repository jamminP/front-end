import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import AppContent from './AppContent';

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
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
    </BrowserRouter>
  );
}
