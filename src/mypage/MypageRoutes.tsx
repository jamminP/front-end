import { Route, Routes } from "react-router-dom";
import MyPage from "./MyPage";
import MypageContent from "./components/MypageContent";
import Calendar from "./components/Calendar";
import Challenge from "./components/Challenge";

export default function MypageRoutes() {
  return (
    <Routes>
      <Route path="/mypage" element={<MyPage />}>
        <Route index element={<MypageContent />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="challenge" element={<Challenge />} />
      </Route>
    </Routes>
  );
}
