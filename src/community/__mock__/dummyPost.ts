export type Category = 'study' | 'share' | 'free' | 'all';

export interface FreeBoardResponse {
  image_url: string | null;
}

export interface dataShareResponse {
  file_url?: string | null;
  img_url?: string | null;
  description?: string | null;
}

export interface StudyRecruitmentResponse {
  badge?: string; // "모집중", "마감" 등
  remaining?: number; // 남은 인원
  max_member?: number; // 최대 인원
  recruit_start?: string;
  recruit_end?: string;
}

export interface FreePostResponse {
  id: number;
  title: string;
  content: string;
  category: 'free';
  author_id: string;
  views: number;
  created_at: string;
  updated_at: string;
  free_board?: FreeBoardResponse;
}

export interface SharePostResponse {
  id: number;
  title: string;
  content: string;
  category: 'share';
  author_id: string;
  views: number;
  data_share: dataShareResponse;
  created_at: string;
  updated_at: string;
}

export interface StudyPostResponse {
  id: number;
  title: string;
  content: string;
  category: 'study';
  author_id: string;
  views: number;
  study_recruitment: StudyRecruitmentResponse;
  created_at: string;
  updated_at: string;
}

export interface AllPostResponse {
  id: number;
  title: string;
  content: string;
  category: Category;
  author_id: string;
  views: number;
  study_recruitment?: StudyRecruitmentResponse;
  free_board?: FreeBoardResponse;
  created_at: string;
  updated_at: string;
}

export type AnyPost = FreePostResponse | SharePostResponse | StudyPostResponse;

// ---------- 더미 데이터 ----------

// 자유 게시판
export const dummyFree: FreePostResponse[] = [
  {
    id: 1,
    title: '자유) 첫 글',
    content: '안녕하세요! 자유게시판 더미 글입니다.',
    category: 'free',
    author_id: '1001',
    views: 42,
    created_at: '2025-08-16T09:00:00Z',
    updated_at: '2025-08-16T10:00:00Z',
    free_board: { image_url: null },
  },
  {
    id: 2,
    title: '자유) 리액트 질문 있어요',
    content: 'useEffect 의존성 배열에 대해 궁금합니다.',
    category: 'free',
    author_id: '1002',
    views: 18,
    created_at: '2025-08-16T11:00:00Z',
    updated_at: '2025-08-16T11:20:00Z',
    free_board: { image_url: null },
  },
  {
    id: 3,
    title: '자유) 오늘의 개발일지',
    content: '커서 기반 무한스크롤 붙였다!',
    category: 'free',
    author_id: '1003',
    views: 77,
    created_at: '2025-08-17T08:30:00Z',
    updated_at: '2025-08-17T08:35:00Z',
    free_board: { image_url: null },
  },
  {
    id: 4,
    title: '자유) 사이드바 랭킹 테스트',
    content: 'views 값으로 상위 노출 확인',
    category: 'free',
    author_id: '1004',
    views: 230,
    created_at: '2025-08-17T12:00:00Z',
    updated_at: '2025-08-17T12:10:00Z',
    free_board: { image_url: null },
  },
  {
    id: 5,
    title: '자유) 타입스크립트 팁',
    content: '유니온 좁히기, 제네릭 팁 공유합니다.',
    category: 'free',
    author_id: '1005',
    views: 129,
    created_at: '2025-08-18T06:00:00Z',
    updated_at: '2025-08-18T06:10:00Z',
    free_board: { image_url: null },
  },
  {
    id: 6,
    title: '자유) tanstack query 캐시전략',
    content: 'staleTime과 gcTime을 어떻게 둘까?',
    category: 'free',
    author_id: '1006',
    views: 9,
    created_at: '2025-08-18T09:00:00Z',
    updated_at: '2025-08-18T09:15:00Z',
    free_board: { image_url: null },
  },
  {
    id: 7,
    title: '자유) 디자인 시스템 추천',
    content: 'shadcn/ui vs 자체 구성',
    category: 'free',
    author_id: '1007',
    views: 61,
    created_at: '2025-08-18T14:00:00Z',
    updated_at: '2025-08-18T14:05:00Z',
    free_board: { image_url: null },
  },
  {
    id: 8,
    title: '자유) 이번 주 목표',
    content: '목 데이터 복구 끝내기!',
    category: 'free',
    author_id: '1008',
    views: 88,
    created_at: '2025-08-19T02:00:00Z',
    updated_at: '2025-08-19T02:10:00Z',
    free_board: { image_url: null },
  },
];

// 자료공유
export const dummyShare: SharePostResponse[] = [
  {
    id: 11,
    title: '공유) 리액트 훅 정리 PDF',
    content: '정리본 PDF 첨부합니다.',
    category: 'share',
    author_id: '2001',
    views: 154,
    data_share: { file_url: '/assets/hooks.pdf', img_url: null, description: '리액트 훅 요약' },
    created_at: '2025-08-16T09:00:00Z',
    updated_at: '2025-08-16T09:10:00Z',
  },
  {
    id: 12,
    title: '공유) 타입스크립트 치트시트',
    content: 'ts 한글 치트시트 링크',
    category: 'share',
    author_id: '2002',
    views: 95,
    data_share: { file_url: null, img_url: null, description: '링크 모음' },
    created_at: '2025-08-16T13:00:00Z',
    updated_at: '2025-08-16T13:05:00Z',
  },
  {
    id: 13,
    title: '공유) UI 컴포넌트 예시',
    content: '버튼/카드 패턴 공유',
    category: 'share',
    author_id: '2003',
    views: 12,
    data_share: { file_url: null, img_url: '/assets/ui.png', description: '샘플 스크린샷' },
    created_at: '2025-08-17T07:00:00Z',
    updated_at: '2025-08-17T07:03:00Z',
  },
  {
    id: 14,
    title: '공유) 무한스크롤 샘플 코드',
    content: 'IntersectionObserver 예시',
    category: 'share',
    author_id: '2004',
    views: 201,
    data_share: {
      file_url: '/assets/infinite-scroll.txt',
      img_url: null,
      description: '코드 조각',
    },
    created_at: '2025-08-17T15:00:00Z',
    updated_at: '2025-08-17T15:05:00Z',
  },
  {
    id: 15,
    title: '공유) tanstack query 패턴',
    content: '키 정책/옵션 정리',
    category: 'share',
    author_id: '2005',
    views: 73,
    data_share: { file_url: null, img_url: null, description: '메모' },
    created_at: '2025-08-18T01:00:00Z',
    updated_at: '2025-08-18T01:10:00Z',
  },
];

// 스터디
export const dummyStudy: StudyPostResponse[] = [
  {
    id: 21,
    title: '스터디) React 스터디 모집',
    content: '주 2회 온라인 진행',
    category: 'study',
    author_id: '3001',
    views: 310,
    study_recruitment: { badge: '모집중', remaining: 2, max_member: 6 },
    created_at: '2025-08-16T09:00:00Z',
    updated_at: '2025-08-16T09:20:00Z',
  },
  {
    id: 22,
    title: '스터디) 알고리즘 스터디',
    content: '백준 실버→골드 목표',
    category: 'study',
    author_id: '3002',
    views: 51,
    study_recruitment: { badge: '모집중', remaining: 4, max_member: 8 },
    created_at: '2025-08-16T12:00:00Z',
    updated_at: '2025-08-16T12:10:00Z',
  },
  {
    id: 23,
    title: '스터디) 타입스크립트 서적 완독',
    content: '한 달 로드맵',
    category: 'study',
    author_id: '3003',
    views: 19,
    study_recruitment: { badge: '모집중', remaining: 1, max_member: 5 },
    created_at: '2025-08-17T06:30:00Z',
    updated_at: '2025-08-17T06:40:00Z',
  },
  {
    id: 24,
    title: '스터디) 면접 스터디',
    content: 'CS/코테/프로젝트 발표',
    category: 'study',
    author_id: '3004',
    views: 205,
    study_recruitment: { badge: '마감', remaining: 0, max_member: 10 },
    created_at: '2025-08-17T18:00:00Z',
    updated_at: '2025-08-17T18:05:00Z',
  },
];
export const dummyPosts: AllPostResponse[] = [
  {
    id: 1,
    title: '자유) 첫 글',
    content: '안녕하세요! 자유게시판 더미 글입니다.',
    category: 'all',
    author_id: '1001',
    views: 42,
    created_at: '2025-08-16T09:00:00Z',
    updated_at: '2025-08-16T10:00:00Z',
    free_board: { image_url: null },
  },
  {
    id: 2,
    title: '자유) 리액트 질문 있어요',
    content: 'useEffect 의존성 배열에 대해 궁금합니다.',
    category: 'free',
    author_id: '1002',
    views: 18,
    created_at: '2025-08-16T11:00:00Z',
    updated_at: '2025-08-16T11:20:00Z',
    free_board: { image_url: null },
  },
  {
    id: 3,
    title: '자유) 오늘의 개발일지',
    content: '커서 기반 무한스크롤 붙였다!',
    category: 'free',
    author_id: '1003',
    views: 77,
    created_at: '2025-08-17T08:30:00Z',
    updated_at: '2025-08-17T08:35:00Z',
    free_board: { image_url: null },
  },
  {
    id: 4,
    title: '자유) 사이드바 랭킹 테스트',
    content: 'views 값으로 상위 노출 확인',
    category: 'free',
    author_id: '1004',
    views: 230,
    created_at: '2025-08-17T12:00:00Z',
    updated_at: '2025-08-17T12:10:00Z',
    free_board: { image_url: null },
  },
  {
    id: 5,
    title: '자유) 타입스크립트 팁',
    content: '유니온 좁히기, 제네릭 팁 공유합니다.',
    category: 'free',
    author_id: '1005',
    views: 129,
    created_at: '2025-08-18T06:00:00Z',
    updated_at: '2025-08-18T06:10:00Z',
    free_board: { image_url: null },
  },
  {
    id: 6,
    title: '자유) tanstack query 캐시전략',
    content: 'staleTime과 gcTime을 어떻게 둘까?',
    category: 'free',
    author_id: '1006',
    views: 9,
    created_at: '2025-08-18T09:00:00Z',
    updated_at: '2025-08-18T09:15:00Z',
    free_board: { image_url: null },
  },
  {
    id: 7,
    title: '자유) 디자인 시스템 추천',
    content: 'shadcn/ui vs 자체 구성',
    category: 'free',
    author_id: '1007',
    views: 61,
    created_at: '2025-08-18T14:00:00Z',
    updated_at: '2025-08-18T14:05:00Z',
    free_board: { image_url: null },
  },
  {
    id: 8,
    title: '자유) 이번 주 목표',
    content: '목 데이터 복구 끝내기!',
    category: 'free',
    author_id: '1008',
    views: 88,
    created_at: '2025-08-19T02:00:00Z',
    updated_at: '2025-08-19T02:10:00Z',
    free_board: { image_url: null },
  },
];

// ---------- 유틸 ----------

export function topN<T extends AnyPost>(arr: T[], n: number) {
  return [...arr].sort((a, b) => b.views - a.views).slice(0, n);
}

export const dummyAll: AnyPost[] = [...dummyFree, ...dummyShare, ...dummyStudy];

// CursorPage 타입(네 프로젝트에서 쓰던 형태)
export type CursorPage<T> = {
  items: T[];
  nextCursor: number | null;
};

// 간단 cursor 시뮬레이터: cursor를 "offset"으로 사용
function sliceByCursor<T extends AnyPost>(
  src: T[],
  cursor: number | null | undefined,
  limit = 20,
  q?: string,
): CursorPage<T> {
  const offset = Math.max(0, Number(cursor) || 0);
  let filtered = src;

  // 검색어 간단 필터(제목/내용)
  if (q && q.trim()) {
    const key = q.trim().toLowerCase();
    filtered = src.filter(
      (p) => p.title.toLowerCase().includes(key) || p.content.toLowerCase().includes(key),
    );
  }

  const items = filtered.slice(offset, offset + limit);
  const nextCursor = offset + items.length < filtered.length ? offset + items.length : null;

  return { items, nextCursor };
}

// 카테고리별 list-cursor 모의
export function getDummyListCursor(
  category: 'all' | 'free' | 'share' | 'study',
  cursor: number | null | undefined,
  q?: string,
  limit = 20,
): CursorPage<AnyPost> {
  switch (category) {
    case 'free':
      return sliceByCursor(dummyFree, cursor, limit, q);
    case 'share':
      return sliceByCursor(dummyShare, cursor, limit, q);
    case 'study':
      return sliceByCursor(dummyStudy, cursor, limit, q);
    case 'all':
    default:
      // all은 최신 created_at 순으로 정렬(간단 구현)
      const sorted = [...dummyAll].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      return sliceByCursor(sorted, cursor, limit, q);
  }
}

// 상세 모의
export function getDummyDetail(category: 'free' | 'share' | 'study', id: number): AnyPost | null {
  const pool = category === 'free' ? dummyFree : category === 'share' ? dummyShare : dummyStudy;

  return pool.find((p) => p.id === id) ?? null;
}
