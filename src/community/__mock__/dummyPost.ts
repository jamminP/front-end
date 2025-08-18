import { CursorPage } from '../api/community';
import type {
  FreePostResponse,
  FreePostUpdateRequest,
  SharePostResponse,
  SharePostUpdateRequest,
  StudyPostResponse,
  StudyPostUpdateRequest,
} from '../api/types';
import { Post } from '../components/Postcard';

export type CommentTreeItem = {
  id: number;
  post_id: number;
  content: string;
  author_id: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
};

const iso = (s: string) => new Date(s).toISOString();

export const dummyFree: FreePostResponse[] = [
  {
    id: 101,
    title: '오늘 날씨가 좋아요',
    content: '점심에 산책 어떰?',
    category: 'free',
    author_id: 2001,
    views: 12,
    free_board: { image_url: null },
    created_at: iso('2025-08-08T10:00:00'),
    updated_at: iso('2025-08-08T10:00:00'),
  },
  {
    id: 102,
    title: '무무의 잡담',
    content: '오늘 너무 덥다…',
    category: 'free',
    author_id: 2002,
    views: 34,
    free_board: { image_url: 'https://picsum.photos/seed/free102/800/400' },
    created_at: iso('2025-08-08T09:30:00'),
    updated_at: iso('2025-08-08T09:30:00'),
  },
];

export const dummyShare: SharePostResponse[] = [
  {
    id: 201,
    title: 'React 자료 모음.zip 공유합니다',
    content: '공식 문서/정리/유튜브 링크 묶음',
    category: 'share',
    author_id: 2004,
    views: 55,
    data_share: { file_url: 'https://example.com/react-pack.zip' },
    created_at: iso('2025-08-08T11:00:00'),
    updated_at: iso('2025-08-08T11:00:00'),
  },
  {
    id: 202,
    title: '면접 질문 리스트',
    content: 'FE/BE 공통 50문항',
    category: 'share',
    author_id: 2001,
    views: 18,
    data_share: { file_url: null },
    created_at: iso('2025-08-07T13:00:00'),
    updated_at: iso('2025-08-07T13:00:00'),
  },
];

export const dummyStudy: StudyPostResponse[] = [
  {
    id: 301,
    title: 'React 스터디 주말 모집합니다',
    content: '기초부터 실전까지 함께해요!',
    category: 'study',
    author_id: 2006,
    views: 41,
    study_recruitment: {
      recruit_start: iso('2025-08-07T00:00:00'),
      recruit_end: iso('2025-08-10T23:59:59'),
      study_start: iso('2025-08-11T00:00:00'),
      study_end: iso('2025-09-11T23:59:59'),
      max_member: 6,
    },
    created_at: iso('2025-08-04T08:00:00'),
    updated_at: iso('2025-08-04T08:00:00'),
  },
];

// ---------- 더미 댓글 데이터 ----------
export const dummyComments: Record<number, CommentTreeItem[]> = {
  201: [
    {
      id: 5001,
      post_id: 201,
      content: '와 감사합니다!',
      author_id: 3001,
      parent_id: null,
      created_at: iso('2025-08-08T11:10:00'),
      updated_at: iso('2025-08-08T11:10:00'),
    },
    {
      id: 5002,
      post_id: 201,
      content: '도움 많이 됐어요 🙏',
      author_id: 3002,
      parent_id: 5001,
      created_at: iso('2025-08-08T11:12:00'),
      updated_at: iso('2025-08-08T11:12:00'),
    },
  ],
  301: [
    {
      id: 5101,
      post_id: 301,
      content: '참여하고 싶어요!',
      author_id: 3003,
      parent_id: null,
      created_at: iso('2025-08-08T09:10:00'),
      updated_at: iso('2025-08-08T09:10:00'),
    },
  ],
};

function makeCursorPage<T>(all: T[], cursor: number | null | undefined, size = 20): CursorPage<T> {
  const start = cursor ? Number(cursor) : 0;
  const items = all.slice(start, start + size);
  const next = start + size < all.length ? start + size : null;
  return { items, nextCursor: next };
}

export const mockFreeListCursor = (cursor: number | null | undefined) =>
  Promise.resolve(makeCursorPage(dummyFree, cursor));

export const mockShareListCursor = (cursor: number | null | undefined) =>
  Promise.resolve(makeCursorPage(dummyShare, cursor));

export const mockStudyListCursor = (cursor: number | null | undefined) =>
  Promise.resolve(makeCursorPage(dummyStudy, cursor));

const likeStore = new Map<number, Set<number>>(); // postId -> Set<userId>
export const mockReadLikeCount = async (postId: number) => ({
  count: likeStore.get(postId)?.size ?? 0,
});
export const mockLikeStatus = async (postId: number, userId?: number) => ({
  liked: !!userId && likeStore.get(postId)?.has(userId) === true,
});
export const mockToggleLike = async (postId: number, userId?: number) => {
  if (!userId) return;
  const set = likeStore.get(postId) ?? new Set<number>();
  set.has(userId) ? set.delete(userId) : set.add(userId);
  likeStore.set(postId, set);
};

export const mockGetFree = async (id: number) => {
  const d = dummyFree.find((x) => x.id === id);
  if (!d) throw new Error('not found');
  return d;
};
export const mockGetShare = async (id: number) => {
  const d = dummyShare.find((x) => x.id === id);
  if (!d) throw new Error('not found');
  return d;
};
export const mockGetStudy = async (id: number) => {
  const d = dummyStudy.find((x) => x.id === id);
  if (!d) throw new Error('not found');
  return d;
};

export const mockListComments = async (postId: number): Promise<CommentTreeItem[]> => {
  return dummyComments[postId] ? [...dummyComments[postId]] : [];
};

export const mockPatchFree = async (id: number, body: FreePostUpdateRequest) => {
  const idx = dummyFree.findIndex((x) => x.id === id);
  if (idx < 0) throw new Error('not found');
  const prev = dummyFree[idx];
  const next: FreePostResponse = {
    ...prev,
    title: body.title ?? prev.title,
    content: body.content ?? prev.content,
    updated_at: new Date().toISOString(),
  };
  dummyFree[idx] = next;
  return structuredClone(next);
};

export const mockPatchShare = async (id: number, body: SharePostUpdateRequest) => {
  const idx = dummyShare.findIndex((x) => x.id === id);
  if (idx < 0) throw new Error('not found');
  const prev = dummyShare[idx];
  const next: SharePostResponse = {
    ...prev,
    title: body.title ?? prev.title,
    content: body.content ?? prev.content,
    data_share: { file_url: body.file_url ?? prev.data_share?.file_url ?? null },
    updated_at: new Date().toISOString(),
  };
  dummyShare[idx] = next;
  return structuredClone(next);
};

export const mockPatchStudy = async (id: number, body: StudyPostUpdateRequest) => {
  const idx = dummyStudy.findIndex((x) => x.id === id);
  if (idx < 0) throw new Error('not found');
  const prev = dummyStudy[idx];
  const next: StudyPostResponse = {
    ...prev,
    title: body.title ?? prev.title,
    content: body.content ?? prev.content,
    study_recruitment: {
      recruit_start: body.recruit_start ?? prev.study_recruitment.recruit_start,
      recruit_end: body.recruit_end ?? prev.study_recruitment.recruit_end,
      study_start: body.study_start ?? prev.study_recruitment.study_start,
      study_end: body.study_end ?? prev.study_recruitment.study_end,
      max_member: body.max_member ?? prev.study_recruitment.max_member,
    },
    updated_at: new Date().toISOString(),
  };
  dummyStudy[idx] = next;
  return structuredClone(next);
};

export const mockDeletePost = async (category: 'free' | 'share' | 'study', id: number) => {
  if (category === 'free') {
    const idx = dummyFree.findIndex((x) => x.id === id);
    if (idx >= 0) dummyFree.splice(idx, 1);
    return;
  }
  if (category === 'share') {
    const idx = dummyShare.findIndex((x) => x.id === id);
    if (idx >= 0) dummyShare.splice(idx, 1);
    return;
  }
  const idx = dummyStudy.findIndex((x) => x.id === id);
  if (idx >= 0) dummyStudy.splice(idx, 1);
  return;
};

export const mockCreateComment = async (
  postId: number,
  content: string,
  userId: number,
  parentId?: number,
): Promise<CommentTreeItem> => {
  const list = (dummyComments[postId] = dummyComments[postId] ?? []);
  const nextId = Math.max(0, ...list.map((c) => c.id)) + 1;
  const now = new Date().toISOString();

  if (parentId != null) {
    const parent = list.find((c) => c.id === parentId);
    if (!parent) throw new Error('parent not found');
    if (parent.parent_id !== null) {
      throw new Error('Replies are allowed only one level deep.');
    }
  }

  const item: CommentTreeItem = {
    id: nextId,
    post_id: postId,
    content,
    author_id: userId,
    parent_id: parentId ?? null,
    created_at: now,
    updated_at: now,
  };
  list.push(item);
  return item;
};

// 검색동작 확인
export function mockSearchAllCursor(
  q: string,
  scope: 'title' | 'content' | 'title+content',
  cursor: number | null | undefined,
  size = 20,
) {
  const text = q.trim().toLowerCase();
  const all = [
    ...dummyFree.map((x) => ({ ...x, category: 'free' as const })),
    ...dummyShare.map((x) => ({ ...x, category: 'share' as const })),
    ...dummyStudy.map((x) => ({ ...x, category: 'study' as const })),
  ].filter((p: any) => {
    if (!text) return false;
    const t = (p.title ?? '').toLowerCase();
    const c = (p.content ?? '').toLowerCase();
    if (scope === 'title') return t.includes(text);
    if (scope === 'content') return c.includes(text);
    return t.includes(text) || c.includes(text);
  });
  all.sort(
    (a: any, b: any) =>
      new Date(b.created_at ?? b.createdAt).valueOf() -
      new Date(a.created_at ?? a.createdAt).valueOf(),
  );
  return Promise.resolve(makeCursorPage(all, cursor, size));
}

export const dummyPosts: Post[] = [
  {
    postId: 1,
    title: 'React 자료 모음.zip 공유합니다',
    author: '쟂니',
    authorId: 2,
    category: 'share',
    content: 'React 공식 문서, 강의, 유튜브 모음입니다.',
    createdAt: '2025-08-06',
    views: 1220,
    likes: 115,
    comments: 53,
  },
  {
    postId: 2,
    title: '오늘 너무 덥다...',
    author: '무무',
    authorId: 3,
    category: 'free',
    content: '밖에 나갔다가 익을 뻔',
    createdAt: '2025-08-06',
    views: 1204,
    likes: 154,
    comments: 34,
  },
  {
    postId: 3,
    title: 'React 스터디 주말 모집합니다',
    author: '에뷔의에뷔',
    authorId: 4,
    category: 'study',
    content: '기초부터 실전까지 함께해요!',
    createdAt: '2025-08-06',
    views: 1220,
    likes: 125,
    comments: 23,
    recruitStart: '2025-08-07',
    recruitEnd: '2025-08-15',
    studyStart: '2025-08-17',
    studyEnd: '2025-10-01',
    maxMembers: 6,
  },
];
