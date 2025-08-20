import { http } from './http';
import type { StudyPlanListRes } from '../types/types';
import { getResolvedUserId } from '../hook/useUserId';
import { pickStudyPlans } from './normalize';

export function getStudyPlans(userId: number, limit = 10, offset = 0) {
  return http.get<StudyPlanListRes>('/api/v1/ai/study_plan', {
    params: { user_id: userId, limit, offset },
  });
}

// 편의 함수: uid를 전달하지 않는 경우 사용할 용도.
export function getStudyPlansForMe(limit = 10, offset = 0) {
  const uid = getResolvedUserId();
  if (!uid) throw new Error('사용자 ID를 확인할 수 없습니다.');

  return getStudyPlans(uid, limit, offset);
}

// 목록만 바로 쓰고 싶을 때
export async function fetchStudyPlanRows(userId: number, limit = 10, offset = 0) {
  const res = await getStudyPlans(userId, limit, offset);
  return pickStudyPlans(res);
}
