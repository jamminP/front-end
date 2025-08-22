import useAuthStore from '@src/store/authStore';
import MyPostsSection from './MyPostsSection';
import LikedPostsSection from './LikedPostsSection';
import NicknameSection from './NicknameSection';

export default function MypageContent() {
  const user = useAuthStore((state) => state.user);

  return (
    <>
      <h2 className="text-3xl md:text-4xl text-[#242424] tracking-[-.05rem]">마이페이지</h2>

      {/* 유저 정보 */}
      <div className="flex items-center justify-between md:justify-items-start mt-[30px] bg-[#e4ecf3] w-full md:w-fit p-[15px] md:p-[20px_25px] rounded-[20px]">
        <div className="flex items-center">
          <div className="w-[40px] h-[40px] rounded-[50%] overflow-hidden">
            <img src={user?.profile_image} className="w-full h-full object-cover" />
          </div>
          <div className="md:m-[0_20px] m-[0_12px] leading-[1.3]">
            <p className="font-bold text-[#1b3043] text-[1.1rem]">{user?.nickname}</p>
            <p className="text-[#5b6b7a] text-[.9rem]">{user?.email}</p>
          </div>
        </div>

        <NicknameSection />
      </div>

      <MyPostsSection />
      <LikedPostsSection />
    </>
  );
}
