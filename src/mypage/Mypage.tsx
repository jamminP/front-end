import { NavLink, Outlet } from 'react-router-dom';

export default function MyPage() {
  return (
    <div className="flex flex-col md:flex-row w-full h-full max-w-[1400px] m-auto p-[100px_0_0_0] md:p-[150px_0_50px_0]">
      <nav className="flex md:flex-col justify-center md:justify-start gap-[30px] md:w-[20%] mt-[5px]">
        <NavLink
          to="/mypage"
          end
          className={({ isActive }) =>
            `text-[16px] md:text-[20px] font-bold tracking-[-.03rem] w-fit ${
              isActive ? 'text-[#0180F5]' : 'text-[#878787]'
            }`
          }
        >
          마이페이지
        </NavLink>
        <NavLink
          to="/mypage/calendar"
          end
          className={({ isActive }) =>
            `text-[16px] md:text-[20px] font-bold tracking-[-.03rem] w-fit ${
              isActive ? 'text-[#0180F5]' : 'text-[#878787]'
            }`
          }
        >
          캘린더
        </NavLink>
        <NavLink
          to="/mypage/challenge"
          end
          className={({ isActive }) =>
            `text-[16px] md:text-[20px] font-bold tracking-[-.03rem] w-fit ${
              isActive ? 'text-[#0180F5]' : 'text-[#878787]'
            }`
          }
        >
          챌린지
        </NavLink>
        <NavLink
          to="/mypage/applicants"
          end
          className={({ isActive }) =>
            `text-[16px] md:text-[20px] font-bold tracking-[-.03rem] w-fit ${
              isActive ? 'text-[#0180F5]' : 'text-[#878787]'
            }`
          }
        >
          스터디 신청자 목록
        </NavLink>
      </nav>
      <section className="w-[90%] m-[50px_auto] md:m-[0] md:w-[80%]">
        <Outlet />
      </section>
    </div>
  );
}
