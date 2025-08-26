import { SlidesSchema } from './featureMosaic.schema';
import studyPlan from '../img/studyPlan.png';
import studyCommunity from '../img/studyCommunity.png';
import communityMosaic from '../img/communityMosaic.png';

const raw = [
  {
    id: 'plan',
    title: 'AI가 추천하는 맞춤 학습 플랜',
    subtitle: '간단한 채팅으로 빠르게 분석!',
    description: '채팅 기반 AI 분석으로 최적화된 학습 계획을 제안합니다.',
    image: studyPlan,
    imageAlt: 'AI가 학습 계획을 제안하는 장면',
    cta: { label: '플랜 사용해보기', to: '/ai' },
  },
  {
    id: 'study',
    title: '나에게 딱 맞는 스터디 추천',
    subtitle: '관심 분야와 실력을 기반으로',
    description: '협업할 스터디를 커뮤니티에서 찾아보세요.',
    image: studyCommunity,
    imageAlt: 'AI와 사람이 스터디를 논의하는 그림',
    cta: { label: '스터디 찾기', to: '/community/study' },
  },
  {
    id: 'community',
    title: '나의 정보를 공유하는 커뮤니티',
    subtitle: '오늘 생각했던 모든 생각을',
    description: '다른 사람들과 함께 소통하며 넓혀가보세요.',
    image: communityMosaic,
    imageAlt: '커뮤니티 대화 일러스트',
    cta: { label: '커뮤니티로 이동하기', to: '/community' },
  },
] as const;

export const mosaicFeatureData = SlidesSchema.parse(raw);
