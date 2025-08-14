import { FaCheck } from 'react-icons/fa';
import BenefitRendingImg from '../img/ready_to_next_level.jpg';

function BenefitLanding() {
  return (
    <div className="relative w-full max-w-screen-xl mx-auto px-40 flex justify-between items-center mt-12 mb-12">
      <div className="pr-10">
        <h2 className="text-4xl font-bold">저희와 함께</h2>
        <h2 className="text-4xl font-bold mt-4">AI를 활용하여</h2>
        <h2 className="text-4xl font-bold mt-4 mb-10">계획 수립!</h2>
        <div className="pl-1 text-base font-medium text-gray-500 ">
          <p className="flex items-center gap-3">
            <FaCheck className="text-[#006ACB]" /> 공부 계획의 도움이 가능합니다.
          </p>
          <p className="mt-6 flex items-center gap-3">
            <FaCheck className="text-[#006ACB]" /> 예상 문제 제작이 가능합니다.
          </p>
          <p className="mt-6 flex items-center gap-3">
            <FaCheck className="text-[#006ACB]" /> 요약 정리로 보다 성장해보세요.
          </p>
          <p className="mt-6 flex items-center gap-3">
            <FaCheck className="text-[#006ACB]" /> 커뮤니티에서 정보를 공유해보세요.
          </p>
        </div>
      </div>
      <div>
        <img src={BenefitRendingImg} alt="BenefitRending Image" className="w-90 h-auto" />
      </div>
    </div>
  );
}

export default BenefitLanding;
