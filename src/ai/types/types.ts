// ===== 서버 응답/목록 타입 =====
export type StudyPlan = {
  id: number;
  user_id: number;
  input_data: string;
  output_data: string;
  is_challenge: boolean;
  start_date: string;
  end_date: string;
  created_at: string;
};

export type StudyPlanListRes = {
  success: boolean;
  message: string;
  data: { study_plans: StudyPlan[] };
};

export type SummaryItem = {
  id: number;
  user_id: number;
  title?: string;
  input_type: string;
  input_data: string;
  summary_type: string;
  output_data: string;
  file_url: string;
  created_at: string;
};

export type SummaryListRes = {
  success: boolean;
  message: string;
  data: { summaries: SummaryItem[] };
};

// ===== 액션/외부 커맨드 =====
export type ActionId = 'plan' | 'summary' | 'quiz' | 'research';

export type StartCommand = {
  type: 'start';
  actionId: ActionId;
  token: number;
};

// ===== 메시지(채팅) 타입 =====
export type BaseMsg = {
  id: string;
  role: 'assistant' | 'user';
  ts: number;
};

export type TextMsg = BaseMsg & {
  kind?: 'text';
  text: string;
};

export type LoadingMsg = BaseMsg & {
  kind: 'loading';
  text?: string;
};

export type TypingMsg = BaseMsg & {
  kind: 'typing';
};

export type CalendarMsg = BaseMsg & {
  kind: 'calendar';
  locked?: boolean;
};

export type ChoiceOption = { value: string; label: string };

export type ChoiceUI = {
  variant?: 'pill' | 'ox';
  question?: string; // ← 질문 문구
  align?: 'left' | 'center';
};

export type ChoiceMsg = BaseMsg & {
  kind: 'choice';
  options: ChoiceOption[];
  disabled?: boolean;
  ui?: ChoiceUI;
};

// 플랜 프리뷰 데이터
export type PlanData = {
  title?: string;
  total_weeks?: number;
  difficulty?: string;
  estimated_total_hours?: number;
  challenge_mode?: boolean;
  description?: string;
  weekly_plans?: any[];
  milestones?: any[];
  resources?: any[];
  tips?: string[];
  [key: string]: any;
};

export type PlanMsg = BaseMsg & {
  kind: 'plan';
  plan: PlanData;
};

// 챌린지 참여 확인 프롬프트
export type ChallengePromptInfo = { start: string; end: string; days: number };
export type ChallengePromptMsg = BaseMsg & {
  kind: 'challenge_prompt';
  info: ChallengePromptInfo;
};

export type KeywordsMsg = BaseMsg & {
  kind: 'keywords';
  keywords: string[];
  title?: string;
};

export type PointsMsg = BaseMsg & {
  kind: 'points';
  title?: string;
  points: string[];
};

// 최종 유니온
export type Msg =
  | TextMsg
  | LoadingMsg
  | TypingMsg
  | CalendarMsg
  | PlanMsg
  | ChallengePromptMsg
  | ChoiceMsg
  | KeywordsMsg
  | PointsMsg;
