import { z } from "zod";
import { FaRobot, FaUser } from "react-icons/fa";

export const ShortcutCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.any(),
  buttonText: z.string(),
  link: z.string(),
});

export const ShortcutCardListSchema = z.array(ShortcutCardSchema);

export const rawShortcutCards = [
  {
    title: "AI 사용하기",
    description: "AI 기능을 사용하여 맞춤형 서비스를 경험하세요.",
    icon: FaRobot,
    buttonText: "사용하기",
    link: "#", // 실제 URL로 변경 가능
  },
  {
    title: "커뮤니티 바로가기",
    description: "다른 사용자들과 소통하며 지식을 나누세요.",
    icon: FaUser,
    buttonText: "바로가기",
    link: "#",
  },
];

export const shortcutCards = ShortcutCardListSchema.parse(rawShortcutCards);
export type ShortcutCard = z.infer<typeof ShortcutCardSchema>;
