export type Category = 'free' | 'share' | 'study' | 'all';

export interface FreePostItem {
  id: number;
  title: string;
  content: string;
  category: 'free';
  author_id: string;
  views: number;
  created_at: string;
  imageUrl?: string | null;
}

export interface SharePostItem {
  id: number;
  title: string;
  content: string;
  category: 'share';
  author_id: string;
  views: number;
  created_at: string;
  updated_at: string;
  data_share?: { file_url?: string | null; img_url?: string | null; description?: string | null };
}

export interface StudyPostItem {
  id: number;
  title: string;
  content: string;
  category: 'study';
  author_id: string;
  views: number;
  created_at: string;
  updated_at: string;
  study_recruitment: {
    badge?: string;
    max_member?: number;
    recruit_start?: string;
    recruit_end?: string;
    study_start?: string;
    study_end?: string;
  };
}

export type AllPostItem = {
  id: number;
  contents: string;
  category: 'free' | 'share' | 'study';
  title: string;
  author_id: string;
  views: number;
  created_at: string;
  badge?: string;
  remaining?: number;
  max_member?: number;
};

export interface FreePostRequest {
  title: string;
  content: string;
  user_id: number;
  category: 'free';
}
export interface FreeBoardResponse {
  image_url: string | null;
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

export interface SharePostRequest {
  title: string;
  content: string;
  user_id: number;
  file_url?: string | null;
  img_url?: string | null;
  category?: 'share';
}
export interface d_ataShareResponse {
  file_url: string | null;
}
export interface SharePostResponse {
  id: number;
  title: string;
  content: string;
  category: 'share';
  author_id: string;
  views: number;
  data_share: d_ataShareResponse;
  created_at: string;
  updated_at: string;
}

export interface StudyPostRequest {
  title: string;
  content: string;
  category?: 'study';
  user_id: number;
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
  author_id: string;
  views: number;
  study_recruitment: StudyRecruitmentResponse;
  created_at: string;
  updated_at: string;
}

export type FreePostUpdateRequest = Partial<Pick<FreePostRequest, 'title' | 'content'>>;
export type SharePostUpdateRequest = Partial<Pick<SharePostRequest, 'title' | 'content'>> & {
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
  user?: number;
  content: string;
  parent_comment_id: number;
}
export interface CommentResponse {
  id: number;
  post_id: number;
  content: string;
  author_nickname: string;
  author_id: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface GETCommentResponse {
  total: string;
  count: string;
  items: CommentResponse[];
}

export type AllPostResponse = FreePostResponse | SharePostResponse | StudyPostResponse;

export interface Post {
  post_id: number;
  title: string;
  content: string;
  author_id: string;
  category: Category;
  created_at: string;
  views: number;
  likes?: number;
  comments?: number;
}

export type SearchIn = 'title' | 'content' | 'title_content' | 'author';

export interface ListCursorParams {
  limit?: number;
  author_id?: number;
  cursor?: string | null;
  search_in?: SearchIn;
  keyword?: string;
  date_from?: string;
  date_to?: string;
  badge?: string;
}

export interface ListCursorResult<T> {
  count: number;
  next_cursor: string | null;
  items: T[];
}

export interface SearchPostItem {
  post_id: number;
  title: string;
  content: string;
  category: Category;
  created_at: string;
  badge?: '모집중' | '모집완료';
}

export type TopCategory = 'study' | 'free' | 'share';

export interface TopWeeklyItem {
  post_id: number;
  title: string;
  category: TopCategory;
  author_id: number; // author_id 타입 재정립 필요가 있음 일단 int로 받기.
  total_views_7d: number;
  created_at: string;
}

export interface TopWeeklyResponse {
  category: TopCategory;
  count: number;
  items: TopWeeklyItem[];
}
