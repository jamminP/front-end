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
