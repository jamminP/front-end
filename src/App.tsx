import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import CommunityLayout from "./community/CommunityLayout";
import Header from "./header/Header";
import MyPage from "./mypage/Mypage";
import MypageContent from "./mypage/components/MypageContent";
import Calendar from "./mypage/components/Calendar";
import Challenge from "./mypage/components/Challenge";
import Login from "./login/Login";
import LandingPage from "@landing/LandingPage";
    
function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
<!--      <LandingPage></LandingPage> 추후에 라우터 연결 작업 필요-->
<!--      <CommunityLayout />  추후에 라우터 연결 작업 필요-->
          <Route path="/login" element={<Login />} />
          <Route path="/mypage" element={<MyPage />}>
            <Route index element={<MypageContent />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="challenge" element={<Challenge />} />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
