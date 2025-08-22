import { Outlet, useLocation } from 'react-router-dom';
import CommunityTab from './components/CommunityTab';
import SidebarRanking from './components/SidebarRanking';
import CreatePostButton from './components/CreatePostButton';

const dummyfreePost = [
  { id: 1, title: '오늘 날씨가 좋아요' },
  { id: 2, title: '2번 제목' },
  { id: 3, title: '저녁 뭐 먹지?' },
  { id: 4, title: '아무말' },
  { id: 5, title: '에뷔 좋네요' },
];

const dummyStudyPost = [
  { id: 11, title: '스터디 일정 공유' },
  { id: 12, title: 'React 공부 팁' },
  { id: 13, title: '스터디 인원 모집' },
  { id: 14, title: '이번 주 목표' },
  { id: 15, title: '공부 습관 공유' },
];

const dummySharePost = [
  { id: 16, title: '자료 공유' },
  { id: 17, title: '개념 공유' },
  { id: 18, title: '이것저것 공유' },
  { id: 19, title: '공유' },
  { id: 20, title: '도깨비' },
];
// 더미데이터로 구현 확인

const CommunityLayout = () => {
  const location = useLocation();

  const category: 'free' | 'share' | 'study' = location.pathname.includes('/share')
    ? 'share'
    : location.pathname.includes('/study')
      ? 'study'
      : 'free';

  return (
    <div className="w-full flex justify-center px-4 pt-30">
      <div className="w-full max-w-[1000px]">
        {/* 상단 커뮤니티 탭 */}
        <div className="text-center py-2">
          <CommunityTab />
        </div>

        <div className="flex justify-center gap-10 mt-6">
          {/* 좌측 인기글 */}
          <div className="w-[240px]">
            <SidebarRanking />
          </div>

          {/* 본문 */}
          <main className="flex-1 max-w-[600px]">
            <div className="text-sm text-gray-700" />
            <Outlet />
          </main>
          <CreatePostButton
            category={category}
            to="/community/create"
            className="inline-flex self-start h-9 px-3 py-1 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default CommunityLayout;
