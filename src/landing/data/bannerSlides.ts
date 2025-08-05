import { z } from "zod";

export const BannerSlideSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  buttonText: z.string(),
  image: z.string().url().or(z.string()),
});

export const BannerSlideListSchema = z.array(BannerSlideSchema);

export const rawSlides = [
  {
    title: "AI가 추천하는 맞춤 학습 플랜",
    subtitle: "간단한 채팅으로 빠르게 분석!",
    description: "채팅 기반 AI 분석으로 최적화된 학습 계획을 제안합니다",
    buttonText: "플랜 사용해보기",
    image: "/img/AI_learning_plan_example.png",
  },
  {
    title: "나에게 딱 맞는 스터디 추천",
    subtitle: "관심 분야와 실력을 기반으로",
    description: "협업할 스터디를 커뮤니티에서 찾아보세요.",
    buttonText: "스터디 찾기",
    image: "/img/landing_study.png",
  },
  {
    title: "나의 정보를 공유하는 커뮤니티",
    subtitle: "오늘 생각했던 모든 생각을",
    description: "다른 사람들과 함께 소통하며 넓혀가보세요.",
    buttonText: "커뮤니티로 이동하기",
    image: "/img/landing_community.png",
  },
];

export const bannerSlides = BannerSlideListSchema.parse(rawSlides);
export type BannerSlide = z.infer<typeof BannerSlideSchema>;
