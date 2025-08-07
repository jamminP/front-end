export interface Post {
  postId: number;
  title: string;
  content: string;
  author: string;
  category: string;
  createdAt: string;
  likes: number;
  comments: number;
  views: number;

  recruitStart?: string;
  recruitEnd?: string;
  studyStart?: string;
  studyEnd?: string;
  maxMembers?: number;
}

export type PostCategory = 'all' | 'share' | 'study' | 'free';
