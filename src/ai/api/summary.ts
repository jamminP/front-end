import { http } from './http';
import type { SummaryListRes } from '../types/types';
import { getResolvedUserId } from '../hook/useUserId';
import { pickSummaries } from './normalize';

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

// 목록만 바로 쓰고 싶을 때
export async function fetchSummaryRows(userId: number, limit = 10, offset = 0) {
  const res = await getSummaries(userId, limit, offset);
  return pickSummaries(res);
}

// 정보 요약 단일 조회
export function getSummaryById(summaryId: number, withUser = false) {
  const params = withUser ? { user_id: getResolvedUserId() } : undefined;
  return http.get(`/api/v1/ai/summary/${summaryId}`, { params });
}

// 정보 요약 삭제
export function deleteSummary(summaryId: number) {
  return http.delete(`/api/v1/ai/summary/${summaryId}`);
}
