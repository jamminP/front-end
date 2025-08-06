import { Outlet } from "react-router-dom";
import CommunityTab from "./components/CommunityTab";
import SidebarRanking from "./components/SidebarRanking";

const dummyfreePosts = [
  { id: 1, title: "오늘 날씨가 좋아요" },
  { id: 2, title: "2번 제목" },
  { id: 3, title: "저녁 뭐 먹지?" },
  { id: 4, title: "아무말" },
  { id: 5, title: "에뷔 좋네요" },
];

const dummyStudyPosts = [
  { id: 11, title: "스터디 일정 공유" },
  { id: 12, title: "React 공부 팁" },
  { id: 13, title: "스터디 인원 모집" },
  { id: 14, title: "이번 주 목표" },
  { id: 15, title: "공부 습관 공유" },
];

const dummySharePosts = [
  { id: 16, title: "자료 공유" },
  { id: 17, title: "개념 공유" },
  { id: 18, title: "이것저것 공유" },
  { id: 19, title: "공유" },
  { id: 20, title: "도깨비" },
];

const CommunityLayout = () => {
  return (
    <div className="w-full flex justify-center px-4 pt-20">
      <div className="w-full max-w-[1000px]">
        {/* 상단 커뮤니티 탭 */}
        <div className="text-center py-2">
          <CommunityTab />
        </div>

        <div className="flex justify-center gap-10 mt-6">
          {/* 좌측 인기글 */}
          <div className="w-[240px]">
            <SidebarRanking
              freeTop5={dummyfreePosts}
              studyTop5={dummyStudyPosts}
              shareTop5={dummySharePosts}
            />
          </div>

          {/* 본문 */}
          <div className="flex-1 border max-w-[600px] border-black">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityLayout;
