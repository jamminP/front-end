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
import CommunityAll from './community/Category/CommunityAll';
import CommunityFree from './community/Category/CommunityFree';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/community" element={<CommunityLayout />}>
            <Route path="all" element={<CommunityAll />} />
            {/* <Route path="free" element={<CommunityFree />} /> */}
            {/* <Route path="share" element={<CommunityShare />} />
            <Route path="study" element={<CommunityStudy />} /> */}
          </Route>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<MyPage />}>
            <Route index element={<MypageContent />} />
            <Route path="calendar" element={<MyCalendar />} />
            <Route path="challenge" element={<Challenge />} />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
