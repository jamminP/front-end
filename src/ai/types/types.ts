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

export type Msg = {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  ts: number;
};
