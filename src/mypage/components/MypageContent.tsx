export default function MypageContent() {
  return (
    <>
      <h2 className="text-3xl md:text-4xl text-[#242424] tracking-[-.05rem]">
        마이페이지
      </h2>
      <div className="flex mt-[30px]">
        <div>
          <div className="w-[50px] h-[50px] bg-[#d8d8d8] rounded-[50%] mr-[10px]"></div>
        </div>
        <div className="text-[#555555]">
          <p>홍길동</p>
          <p>abc@aaa.com</p>
          <button
            type="button"
            className="p-[10px_15px] bg-[#e4ecf3] mt-[10px] text-[.9rem] font-semibold"
          >
            닉네임 수정하기
          </button>
        </div>
      </div>
      <div className="m-[50px_0]">
        <h3 className="text-[#242424]">작성한 글 보기</h3>
        <ul className="flex items-center flex-wrap gap-[1.2%] w-full mt-[15px]">
          <li className="w-[48%] md:w-[24%] h-[170px] bg-[#d8d8d8] rounded-2xl mb-[1.2%] md:mb-[0]"></li>
          <li className="w-[48%] md:w-[24%] h-[170px] bg-[#d8d8d8] rounded-2xl mb-[1.2%] md:mb-[0]"></li>
          <li className="w-[48%] md:w-[24%] h-[170px] bg-[#d8d8d8] rounded-2xl"></li>
          <li className="w-[48%] md:w-[24%] h-[170px] bg-[#d8d8d8] rounded-2xl"></li>
        </ul>
      </div>
      <div>
        <h3 className="text-[#242424]">좋아요</h3>
        <ul className="flex items-center flex-wrap gap-[1.2%] w-full mt-[15px]">
          <li className="w-[48%] md:w-[24%] h-[170px] bg-[#d8d8d8] rounded-2xl mb-[1.2%] md:mb-[0]"></li>
          <li className="w-[48%] md:w-[24%] h-[170px] bg-[#d8d8d8] rounded-2xl mb-[1.2%] md:mb-[0]"></li>
          <li className="w-[48%] md:w-[24%] h-[170px] bg-[#d8d8d8] rounded-2xl"></li>
          <li className="w-[48%] md:w-[24%] h-[170px] bg-[#d8d8d8] rounded-2xl"></li>
        </ul>
      </div>
    </>
  );
}
