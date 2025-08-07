import { z } from "zod";

export const LendingFAQSchema = z.object({
  id: z.number(),
  question: z.string(),
  answer: z.string(),
});

export const LendingFAQListSchema = z.array(LendingFAQSchema);

export const rawSlides = [
  {
    id: 1,
    question: "회원가입을 해야 하나요?",
    answer:
      "네, 우리 서비스는 로그인 후에만 모든 기능을 이용하실 수 있습니다. 계정을 생성하거나 소셜 로그인을 통해 간편하게 가입하세요.",
  },
  {
    id: 2,
    question: "소셜 로그인 시 어떤 정보를 수집하나요?",
    answer:
      "이름, 이메일, 프로필 사진만 요청합니다. 불필요한 개인 정보는 수집하지 않으니 안심하고 이용하실 수 있습니다.",
  },
  {
    id: 3,
    question: "AI를 통해 무엇을 할 수 있나요?",
    answer:
      "맞춤형 학습 플랜을 작성할 수 있습니다. 학습 목표와 기간을 입력하면 AI가 최적의 계획을 제안합니다.",
  },
  {
    id: 4,
    question: "다른 서비스와의 차별점은 무엇인가요?",
    answer:
      "우리 AI는 학습 플랜을 단순히 생성하는 것을 넘어, 세부 일정과 학습 방법까지 포함하여 더 구체적이고 실현 가능한 계획을 제공합니다.",
  },
];

export const FAQs = LendingFAQListSchema.parse(rawSlides);
export type FAQS = z.infer<typeof LendingFAQSchema>;
