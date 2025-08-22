import useAuthStore from '@src/store/authStore';
import { useState } from 'react';
import axios from 'axios';
import MyPostsSection from './MyPostsSection';
import LikedPostsSection from './LikedPostsSection';

export default function MypageContent() {
  const [nicknameInput, setNicknameInput] = useState('');
  const [nicknameModal, setNicknameModal] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setAuthData = useAuthStore((state) => state.setAuthData);

  // 닉네임 수정 모달
  const openNicknameModal = () => {
    setNicknameInput(user?.nickname || '');
    setNicknameModal(true);
  };
  const closeNicknameModal = () => setNicknameModal(false);

  const handleNicknameUpdate = async () => {
    if (!nicknameInput.trim()) {
      alert('닉네임을 입력해주세요');
      return;
    }
    try {
      const res = await axios.patch(
        'https://backend.evida.site/api/v1/users/myinfo',
        { nickname: nicknameInput },
        { withCredentials: true },
      );
      if (user) {
        setAuthData({
          ...user,
          nickname: res.data.new_nickname,
        });
        alert('수정되었습니다');
      }
      closeNicknameModal();
    } catch (err) {
      console.error('닉네임 변경 실패', err);
    }
  };

  return (
    <>
      <h2 className="text-3xl md:text-4xl text-[#242424] tracking-[-.05rem]">마이페이지</h2>

      {/* 유저 정보 */}
      <div className="flex items-center justify-between md:justify-items-start mt-[30px] bg-[#e4ecf3] w-full md:w-fit p-[15px_20px] md:p-[20px_25px] rounded-[20px]">
        <div className="flex items-center">
          <div className="w-[40px] h-[40px] rounded-[50%] overflow-hidden">
            <img src={user?.profile_image} className="w-full h-full object-cover" />
          </div>
          <div className="m-[0_15px] leading-[1.3]">
            <p className="font-bold text-[#1b3043] text-[1.1rem]">{user?.nickname}</p>
            <p className="text-[#5b6b7a] text-[.9rem]">{user?.email}</p>
          </div>
        </div>

        <button
          type="button"
          className="p-[6px_12px] md:p-[10px_15px] bg-[#1b3043] text-[#ffffff] text-[.9rem] rounded-[100px] font-semibold cursor-pointer"
          onClick={openNicknameModal}
        >
          닉네임 수정
        </button>

        {nicknameModal && (
          <div className="modal-overlay" onClick={closeNicknameModal}>
            <div
              className="relative w-full max-w-[380px] bg-[#ffffff] rounded-[20px] p-[30px]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-[1.1rem] text-[#313131] font-bold mb-[10px]">닉네임 수정하기</h2>
              <div className="md:flex items-center justify-between">
                <input
                  type="text"
                  maxLength={10}
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  className="w-full md:w-[82%] border-[1px] border-[#d1d1d1] rounded-[10px] p-[10px] mr-[10px] mb-[10px] md:mb-[0px]"
                />
                <div className="modal-button">
                  <button onClick={handleNicknameUpdate}>수정</button>
                </div>
              </div>

              <button className="modal-close" onClick={closeNicknameModal}>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        )}
      </div>

      <MyPostsSection />
      <LikedPostsSection />
    </>
  );
}
