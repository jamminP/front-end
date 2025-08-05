import { Children, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const CommunityLayout = ({ children }: Props) => {
  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-[1000px]">
        {/* 상단 커뮤니티 탭 */}
        <div className="border border-black text-center py-2">
          {/* <CommunityTab /> */}
          전체 자료공유 스터디 자유
        </div>

        <div className="flex justify-center gap-10 mt-6">
          {/* 좌측 인기글 */}
          <div className="w-[240px] border border-black">
            {/* <SidebarRanking /> */}
            인기글
          </div>

          {/* 본문 */}
          <div className="flex-1 border max-w-[600px] border-black">
            {/* {children} */}
            게시글
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityLayout;
