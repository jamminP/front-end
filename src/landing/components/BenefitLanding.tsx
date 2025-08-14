import { FaCheck } from 'react-icons/fa';
import BenefitRendingImg from '../img/AI_UnderImage.png';

function BenefitLanding() {
  return (
    <div className="relative w-full max-w-screen-2xl mx-auto md:px-15 flex justify-between mt-12 mb-12">
      <div className="pr-10 flex-1/2">
        <h2 className="text-4xl font-bold md:mb-7 xl:mb-14">
          저희와 함께 AI를 활용하여 계획 수립!
        </h2>
        <div className="pl-1 text-base xl:text-xl font-medium text-gray-500 ">
          <p className="flex items-center md:gap-3 xl:gap-5">
            <FaCheck className="text-[#006ACB]" /> 공부 계획의 도움이 가능합니다.
          </p>
          <p className="mt-6 xl:mt-8 flex items-center md:gap-3 xl:gap-5">
            <FaCheck className="text-[#006ACB]" /> 예상 문제 제작이 가능합니다.
          </p>
          <p className="mt-6 xl:mt-8 flex items-center md:gap-3 xl:gap-5">
            <FaCheck className="text-[#006ACB]" /> 요약 정리로 보다 성장해보세요.
          </p>
          <p className="mt-6 xl:mt-8 flex items-center md:gap-3 xl:gap-5">
            <FaCheck className="text-[#006ACB]" /> 커뮤니티에서 정보를 공유해보세요.
          </p>
        </div>
      </div>
      <div className="flex-1/2">
        <img src={BenefitRendingImg} alt="BenefitRending Image" className="w-120 h-auto" />
      </div>
    </div>
  );
}

export default BenefitLanding;
