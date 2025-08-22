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

export type ActionId = 'plan' | 'summary' | 'quiz' | 'research';

export type StartCommand = {
  type: 'start';
  actionId: ActionId;
  token: number;
};

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
};

export type Msg =
  | TextMsg
  | LoadingMsg
  | TypingMsg
  | CalendarMsg
  | PlanMsg
  | { id: string; role: 'assistant' | 'user'; ts: number; kind?: 'text'; text: string }
  | { id: string; role: 'assistant'; ts: number; kind: 'plan'; plan: PlanData }
  | { id: string; role: 'assistant'; ts: number; kind: 'loading'; text?: string }
  | { id: string; role: 'assistant'; ts: number; kind: 'calendar' };
