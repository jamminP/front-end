import { FaCalendarCheck } from 'react-icons/fa';
import { ActionId } from '../types/types';
import { FaRegFileLines } from 'react-icons/fa6';

export const ACTIONS: {
  id: ActionId;
  title: string;
  desc: string;
  icon: React.ComponentType<{ size?: number }>;
  firstPrompt: string;
}[] = [
  {
    id: 'plan',
    title: '공부 계획',
    desc: '목표/일정/가용시간을 기반으로 학습 플랜을 생성합니다.',
    icon: FaCalendarCheck,
    firstPrompt: '어떤 공부 계획을 원하시나요?',
  },
  {
    id: 'summary',
    title: '정보 요약',
    desc: '긴 글/강의 내용을 한 눈에 보이게 요약합니다.',
    icon: FaRegFileLines,
    firstPrompt: '어떤 내용을 요약할까요? 텍스트나 핵심 포인트를 붙여 넣어주세요.',
  },
];
