import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import CommunityLayout from "./community/CommunityLayout";
import Header from "./header/Header";
import MyPage from "./mypage/Mypage";
import MypageContent from "./mypage/components/MypageContent";
import Challenge from "./mypage/components/Challenge";
import Login from "./login/Login";
import MyCalendar from "./mypage/components/Calendar";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/community" element={<CommunityLayout />} />
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
