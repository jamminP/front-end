import type { CreateSummaryReq } from '../api/summary';

export const PLACEHOLDER_FILE_URL = 'https://example.com/placeholder';

export function deriveTitleFromInput(input: string, maxLen = 40): string {
  const firstLine = (input || '').trim().split(/\r?\n/).find(Boolean) || '';

  const cleaned = firstLine.replace(/^[-•\d\)\(.\s]+/, '').trim();

  return cleaned.length > maxLen ? cleaned.slice(0, maxLen).trim() + '…' : cleaned || '요약';
}

export function buildTextSummaryPayload(text: string): CreateSummaryReq {
  const trimmed = (text || '').trim();
  return {
    title: deriveTitleFromInput(trimmed),
    input_data: trimmed,
    input_type: 'text',
    summary_type: 'general',
    file_url: PLACEHOLDER_FILE_URL,
  };
}
