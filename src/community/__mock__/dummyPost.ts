// src/Community/__mock__/dummyPosts.ts

import { Post } from '../api/community';

export const dummyPosts: Post[] = [
  {
    postId: 1,
    title: 'React 자료 모음.zip 공유합니다',
    author: '쟂니',
    category: 'share',
    content: 'React 공식 문서, 강의, 유튜브 모음입니다.',
    createdAt: '2025-08-06',
    views: 120,
    likes: 15,
    comments: 3,
  },
  {
    postId: 2,
    title: '오늘 너무 덥다...',
    author: '무무',
    category: 'free',
    content: '밖에 나갔다가 익을 뻔',
    createdAt: '2025-08-06',
    views: 88,
    likes: 4,
    comments: 0,
  },
  {
    postId: 3,
    title: 'React 스터디 주말 모집합니다',
    author: '스터디리더',
    category: 'study',
    content: '기초부터 실전까지 함께해요!',
    createdAt: '2025-08-06',
    views: 230,
    likes: 22,
    comments: 7,
    recruitStart: '2025-08-07',
    recruitEnd: '2025-08-15',
    studyStart: '2025-08-17',
    studyEnd: '2025-10-01',
    maxMembers: 6,
  },
];
