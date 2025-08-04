import { Link, Outlet } from "react-router-dom";

export default function MyPage() {
  return (
    <div>
      <nav>
        <Link to="/mypage">마이페이지</Link>
        <Link to="/mypage/calendar">캘린더</Link>
        <Link to="/mypage/challenge">챌린지</Link>
      </nav>
      <section>
        <Outlet />
      </section>
    </div>
  );
}
