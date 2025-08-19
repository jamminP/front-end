import { http } from './http';
import type { StudyPlanListRes } from './types';

export function getStudyPlans(userId: number, limit = 10, offset = 0) {
  const qs = new URLSearchParams({ limit: String(limit), offset: String(offset) }).toString();
  return http<StudyPlanListRes>(`/api/v1/ai/study_plan/${userId}?${qs}`);
}
