import useAuthStore from '@src/store/authStore';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NicknameSection() {
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [nicknameModal, setNicknameModal] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');

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

  const handleWithdrawal = async () => {
    if (!window.confirm('정말 탈퇴하시겠습니까?')) return;
    try {
      await axios.delete('https://backend.evida.site/api/v1/users/withdrawal', {
        withCredentials: true,
      });
      logout();
      navigate('/');
    } catch (err) {
      console.error('실패하였습니다', err);
      alert('회원 탈퇴에 실패했습니다');
    }
  };

  return (
    <>
      <button
        type="button"
        className="p-[6px_12px] md:p-[10px_15px] bg-[#1b3043] text-[#ffffff] text-[.9rem] rounded-[100px] font-semibold cursor-pointer"
        onClick={openNicknameModal}
      >
        닉네임 수정
      </button>
      <button
        type="button"
        className="p-[6px_12px] md:p-[10px_15px] bg-white text-gray-700 ml-[10px] text-[.9rem] rounded-[100px] font-semibold cursor-pointer"
        onClick={handleWithdrawal}
      >
        회원 탈퇴
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
    </>
  );
}
