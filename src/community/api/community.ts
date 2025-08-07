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

export const getPostsByCategory = async (category: string) => {
  const res = await fetch(`/api/community/posts?category=${category}`);
  if (!res.ok) throw new Error('게시글을 불러오지 못했습니다.');
  return res.json();
};

export type PostCategory = 'all' | 'share' | 'study' | 'free';
