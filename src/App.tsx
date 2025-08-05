import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
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
