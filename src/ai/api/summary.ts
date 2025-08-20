import { http } from './http';
import type { SummaryListRes } from '../types/types';
import { getResolvedUserId } from '../hook/useUserId';

export function getSummaries(userId: number, limit = 10, offset = 0) {
  return http.get<SummaryListRes>('/api/v1/ai/summary', {
    params: { user_id: userId, limit, offset },
  });
}

// 편의 함수: uid를 전달하지 않는 경우 사용할 용도.
export function getSummariesForMe(limit = 10, offset = 0) {
  const uid = getResolvedUserId();
  if (!uid) throw new Error('사용자 ID를 확인할 수 없습니다.');
  return getSummaries(uid, limit, offset);
}
