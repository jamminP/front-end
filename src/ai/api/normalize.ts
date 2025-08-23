import type { StudyPlanListRes, SummaryListRes, StudyPlan, SummaryItem } from '../types/types';

export function pickStudyPlans(res: any): StudyPlan[] {
  return res?.data?.data?.study_plans ?? res?.data?.study_plans ?? [];
}

export function pickSummaries(res: any): SummaryItem[] {
  return res?.data?.data?.summaries ?? res?.data?.summaries ?? [];
}

export function pickStudyPlanOne(res: any): StudyPlan | null {
  return (
    res?.data?.data?.study_plan ??
    res?.data?.study_plan ??
    (Array.isArray(res?.data?.data) ? res?.data?.data?.[0] : res?.data?.data) ??
    null
  );
}

export function pickSummaryOne(res: any): SummaryItem | null {
  return (
    res?.data?.data?.summary ??
    res?.data?.summary ??
    (Array.isArray(res?.data?.data) ? res?.data?.data?.[0] : res?.data?.data) ??
    null
  );
}
