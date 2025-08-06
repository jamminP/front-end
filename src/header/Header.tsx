import { Link } from "react-router-dom";
import bellIcon from "../header/img/bell.png";
import { useState } from "react";
import Logo from "./img/Logo.png";

export default function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="fixed flex justify-between items-center w-full p-[20px_30px] md:p-[30px_60px] bg-[#ffffff] z-[999]">
      <Link to="/" className="flex items-center">
        <img src={Logo} alt="logo" className="h-12 w-auto" />
        <h1 className="text-[#1B3043] text-4xl font-extrabold ml-3 mb-2">
          Evi
        </h1>
      </Link>

      <button className="md:hidden" onClick={() => setIsOpen((prev) => !prev)}>
        <div
          className={`${
            isOpen ? "rotate-45 relative top-[7px]" : "rotate-0"
          } w-[25px] h-[2px] bg-black mb-[5px]`}
        ></div>
        <div
          className={`${
            isOpen ? "hidden" : "block"
          } w-[25px] h-[2px] bg-black mb-[5px]`}
        ></div>
        <div
          className={`${
            isOpen ? "rotate-135" : "rotate-0"
          } w-[25px] h-[2px] bg-black`}
        ></div>
      </button>

      <nav
        className={`${
          isOpen ? "flex" : "hidden"
        } w-[50%] md:w-[auto] h-screen md:h-[auto] md:flex flex flex-col md:flex-row absolute md:relative md:items-center gap-[30px] text-[#333] bg-[#fff] top-[72px] md:top-0 right-0 text-right md:text-left p-[30px] md:p-0`}
      >
        <Link to="/" onClick={() => setIsOpen(false)}>
          메인
        </Link>
        <Link to="/ai" onClick={() => setIsOpen(false)}>
          AI
        </Link>
        <Link to="/community" onClick={() => setIsOpen(false)}>
          커뮤니티
        </Link>
        {isLoggedIn ? (
          <>
            <div className="relative">
              <img src={bellIcon} />
              <span className="absolute w-[8px] h-[8px] bg-[#f00] rounded-full top-0 right-0"></span>
            </div>
            <Link to="/mypage" onClick={() => setIsOpen(false)}>
              <div className="w-[40px] h-[40px] rounded-full bg-[#cfcfcf]"></div>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setIsOpen(false)}>
              로그인
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
