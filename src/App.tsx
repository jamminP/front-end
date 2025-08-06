import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import CommunityLayout from "./community/CommunityLayout";
import Header from "./header/Header";
import MyPage from "./mypage/Mypage";
import MypageContent from "./mypage/components/MypageContent";
import Calendar from "./mypage/components/Calendar";
import Challenge from "./mypage/components/Challenge";
import Login from "./login/Login";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/community" element={<CommunityLayout />}>
            {/* <Route path="all" element={<CommunityAll />} />
            <Route path="share" element={<CommunityShare />} />
            <Route path="free" element={<CommunityFree />} />
            <Route path="study" element={<CommunityStudy />} /> */}
          </Route>
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
