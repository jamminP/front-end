import { FaCheck } from 'react-icons/fa';
import BenefitRendingImg from '../img/AI_UnderImage.png';

export default function BenefitLanding() {
  return (
    <div className="relative w-full max-w-screen-2xl mx-auto mt-12 mb-20 px-8 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-8 lg:gap-12">
        <div>
          <h2 className="text-4xl md:text-4xl font-bold mb-5 md:mb-7 xl:mb-14">
            저희와 함께 AI를 활용하여 계획 수립!
          </h2>

          <div className="pl-1 text-base xl:text-xl font-medium text-gray-500 space-y-4 md:space-y-6 xl:space-y-8">
            <p className="flex items-center gap-2 md:gap-3 xl:gap-5">
              <FaCheck className="text-[#006ACB]" /> 공부 계획의 도움이 가능합니다.
            </p>
            <p className="flex items-center gap-2 md:gap-3 xl:gap-5">
              <FaCheck className="text-[#006ACB]" /> 예상 문제 제작이 가능합니다.
            </p>
            <p className="flex items-center gap-2 md:gap-3 xl:gap-5">
              <FaCheck className="text-[#006ACB]" /> 요약 정리로 보다 성장해보세요.
            </p>
            <p className="flex items-center gap-2 md:gap-3 xl:gap-5">
              <FaCheck className="text-[#006ACB]" /> 커뮤니티에서 정보를 공유해보세요.
            </p>
          </div>
        </div>

        <div className="w-full">
          <img
            src={BenefitRendingImg}
            alt="BenefitRending Image"
            className="w-full border-none rounded-2xl md:max-w-[30rem] h-auto mx-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
