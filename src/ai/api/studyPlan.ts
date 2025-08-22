import { http } from './http';
import type { StudyPlanListRes } from '../types/types';
import { getResolvedUserId } from '../hook/useUserId';
import { pickStudyPlans } from './normalize';
import type { AxiosResponse } from 'axios';

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

export type CreateStudyPlanReq = {
  input_data: string;
  start_date: string;
  end_date: string;
  is_challenge: boolean;
};

export type CreateStudyPlanRes = {
  success: boolean;
  message: string;
  data: any;
};

export async function createStudyPlanForMe(
  payload: CreateStudyPlanReq,
): Promise<AxiosResponse<CreateStudyPlanRes>> {
  const uid = getResolvedUserId();
  if (!uid) throw new Error('사용자 ID를 확인할 수 없습니다.');

  return http.post<CreateStudyPlanRes>('/api/v1/ai/study_plan', payload, {
    params: { user_id: uid },
    timeout: 30_000,
  });
}
