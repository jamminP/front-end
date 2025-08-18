export type Category = 'free' | 'share' | 'study';

export interface FreePostItem {
  id: number;
  title: string;
  content: string;
  category: 'free';
  authorId: number;
  createdAt: string;
  imageUrl?: string | null;
}

export interface SharePostItem {
  id: number;
  title: string;
  content: string;
  category: 'share';
  authorId: number;
  createdAt: string;
  fileUrl?: string | null;
  imgUrl?: string | null;
}

export interface StudyPostItem {
  id: number;
  title: string;
  content: string;
  category: 'study';
  authorId: number;
  createdAt: string;
  recruitStart?: string;
  recruitEnd?: string;
  studyStart?: string;
  studyEnd?: string;
  maxMembers?: number;
  badge?: string;
}

export interface AllPostItem {
  id: number;
  title: string;
  content: string;
  category: Category;
  authorId: number;
  createdAt: string;
}

export interface FreePostRequest {
  title: string;
  content: string;
  user_id: number;
  category?: 'free';
}
export interface FreeBoardResponse {
  image_url: string | null;
}
export interface FreePostResponse {
  id: number;
  title: string;
  content: string;
  category: 'free';
  author_id: number;
  views: number;
  free_board: FreeBoardResponse;
  created_at: string;
  updated_at: string;
}

export interface SharePostRequest {
  title: string;
  content: string;
  user_id: number;
  file_url?: string | null;
  img_url?: string | null;
  category?: 'share';
}
export interface DataShareResponse {
  file_url: string | null;
}
export interface SharePostResponse {
  id: number;
  title: string;
  content: string;
  category: 'share';
  author_id: number;
  views: number;
  data_share: DataShareResponse;
  created_at: string;
  updated_at: string;
}

export interface StudyPostRequest {
  title: string;
  content: string;
  user_id: number;
  category?: 'study';
  recruit_start: string;
  recruit_end: string;
  study_start: string;
  study_end: string;
  max_member: number;
}
export interface StudyRecruitmentResponse {
  recruit_start: string;
  recruit_end: string;
  study_start: string;
  study_end: string;
  max_member: number;
}
export interface StudyPostResponse {
  id: number;
  title: string;
  content: string;
  category: 'study';
  author_id: number;
  views: number;
  study_recruitment: StudyRecruitmentResponse;
  created_at: string;
  updated_at: string;
}

export type FreePostUpdateRequest = Partial<Pick<FreePostRequest, 'title' | 'content'>>;
export type SharePostUpdateRequestD = Partial<Pick<SharePostRequest, 'title' | 'content'>> & {
  file_url?: string | null;
};
export type StudyPostUpdateRequest = Partial<
  Pick<
    StudyPostRequest,
    | 'title'
    | 'content'
    | 'recruit_start'
    | 'recruit_end'
    | 'study_start'
    | 'study_end'
    | 'max_member'
  >
>;

export interface CommentRequest {
  post_id: number;
  content: string;
  parent_id?: number | null;
  user_id: number;
}
export interface CommentResponse {
  id: number;
  post_id: number;
  content: string;
  author_id: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
}

export type AllPostResponse = FreePostResponse | SharePostResponse | StudyPostResponse;

export interface Post {
  post_id: number;
  title: string;
  content: string;
  author_id: number;
  author: string;
  category: Category;
  created_at: string;
  views: number;
  likes?: number;
  comments?: number;
}

export type SearchScope = 'title' | 'content' | 'title_content';

export interface CursorListResult<T> {
  count: number;
  next_cursor: string | null;
  items: T[];
}

export interface SearchPost {
  post_id: number;
  title: string;
  content: string;
  author_id: string;
  category: Category;
  created_at: string;
}

export interface SearchPostItem {
  post_id: number;
  title: string;
  content: string;
  author_id: string;
  category: Category;
  created_at: string;
  badge?: string;
}
