import { http } from './http';
import type { SummaryListRes } from '../types/types';

export function getSummaries(userId: number, limit = 10, offset = 0) {
  const qs = new URLSearchParams({ limit: String(limit), offset: String(offset) }).toString();
  return http<SummaryListRes>(`/api/summary/${userId}?${qs}`);
}
