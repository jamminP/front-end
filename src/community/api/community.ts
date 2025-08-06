export interface Post {
  postId: number;
  title: string;
  author: string;
  category: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  viewCount: number;
}

export type PostCategory = "all" | "share" | "study" | "Free";
