export type PostCategory = 'all' | 'share' | 'study' | 'free';

export interface Post {
  postId: number;
  title: string;
  author: string;
  authorId: number;
  category: 'free' | 'share' | 'study';
  content: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;

  recruitStart?: string;
  recruitEnd?: string;
  studyStart?: string;
  studyEnd?: string;
  maxMembers?: number;
}

export interface BasePostPayload {
  title: string;
  content: string;
}

export interface StudyPostPatload extends BasePostPayload {
  recruitStart?: string;
  recruitEnd?: string;
  studyStart?: string;
  studyEnd?: string;
  maxMember?: number;
}

export interface PostResponse {
  postId: number;
  title: string;
  authorId: number;
  category: PostCategory;
  createdAt: string;
}

export interface CommentPayload {
  content: string;
}

export interface CommentResponse {
  commentId: number;
  postId: number;
  content: string;
  author: string;
  createdAt: string;
}
