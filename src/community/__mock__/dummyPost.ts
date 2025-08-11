// src/Community/__mock__/dummyPosts.ts

import { Post } from '../api/types';

export const dummyPosts: Post[] = [
  {
    postId: 1,
    title: 'React 자료 모음.zip 공유합니다',
    author: '쟂니',
    authorId: 2,
    category: 'share',
    content: 'React 공식 문서, 강의, 유튜브 모음입니다.',
    createdAt: '2025-08-06',
    viewCount: 120,
    likeCount: 15,
    commentCount: 3,
  },
  {
    postId: 2,
    title: '오늘 너무 덥다...',
    author: '무무',
    authorId: 3,
    category: 'free',
    content: '밖에 나갔다가 익을 뻔',
    createdAt: '2025-08-06',
    viewCount: 88,
    likeCount: 4,
    commentCount: 0,
  },
  {
    postId: 3,
    title: 'React 스터디 주말 모집합니다',
    author: '에뷔의에뷔',
    authorId: 4,
    category: 'study',
    content: '기초부터 실전까지 함께해요!',
    createdAt: '2025-08-06',
    viewCount: 230,
    likeCount: 22,
    commentCount: 7,
    recruitStart: '2025-08-07',
    recruitEnd: '2025-08-15',
    studyStart: '2025-08-17',
    studyEnd: '2025-10-01',
    maxMembers: 6,
  },
];
