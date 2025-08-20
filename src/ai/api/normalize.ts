import type { StudyPlanListRes, SummaryListRes, StudyPlan, SummaryItem } from '../types/types';

export function pickStudyPlans(res: any): StudyPlan[] {
  return res?.data?.data?.study_plans ?? res?.data?.study_plans ?? [];
}

export function pickSummaries(res: any): SummaryItem[] {
  return res?.data?.data?.summaries ?? res?.data?.summaries ?? [];
}
