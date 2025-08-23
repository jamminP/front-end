export type PostCategory = 'all' | 'free' | 'share' | 'study';
export type ItemCategory = 'free' | 'share' | 'study';

// ===== List  =====
export type Badge = '모집중' | '모집완료';

export interface BaseListItem {
  category: ItemCategory;
  title: string;
  author_id: number;
  author_nickname: string;
  created_at: string;
  views: number;
  like_count: number;
  comment_count: number;
}

// 카테고리별 post_id 키 매핑
export type IdKeyOf<C extends ItemCategory> = C extends 'free'
  ? 'free_post_id'
  : C extends 'share'
    ? 'share_post_id'
    : 'study_post_id';

// category에 맞는 id 키 강제 + 카테고리 전용 리스트 필드
export type ListItemOf<C extends ItemCategory> = BaseListItem & { category: C } & Record<
    IdKeyOf<C>,
    number
  > &
  (C extends 'free'
    ? { images?: string[] }
    : C extends 'share'
      ? { files?: string[] }
      : {
          badge: Badge;
          study_recruitment?: {
            recruit_start: string;
            recruit_end: string;
            study_start: string;
            study_end: string;
            max_member: number;
          };
        });

export type FreeListItem = ListItemOf<'free'>;
export type ShareListItem = ListItemOf<'share'>;
export type StudyListItem = ListItemOf<'study'>;
export type ListItem = FreeListItem | ShareListItem | StudyListItem;

export interface CursorPage<T> {
  items: T[];
  next_cursor?: number | null; // ← 스펙에 맞춰 통일
}

// ===== Detail =====
export interface BaseDetail {
  id: number;
  title: string;
  content: string;
  category: ItemCategory;
  author_id: number;
  author_nickname: string;
  views: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

export type FreeDetail = BaseDetail & {
  category: 'free';
  images?: string[];
};

export type ShareDetail = BaseDetail & {
  category: 'share';
  files?: string[];
};

export type StudyDetail = BaseDetail & {
  category: 'study';
  badge: Badge;
  study_recruitment: {
    recruit_start: string;
    recruit_end: string;
    study_start: string;
    study_end: string;
    max_member: number;
  };
};

export type PostDetail = FreeDetail | ShareDetail | StudyDetail;

// 카테고리별 페이지/디테일 반환 타입 매핑
export type PageByCategory<C extends PostCategory> = C extends 'all'
  ? CursorPage<ListItem>
  : C extends 'free'
    ? CursorPage<ListItemOf<'free'>>
    : C extends 'share'
      ? CursorPage<ListItemOf<'share'>>
      : CursorPage<ListItemOf<'study'>>;

export type DetailByCategory<C extends ItemCategory> = C extends 'free'
  ? FreeDetail
  : C extends 'share'
    ? ShareDetail
    : StudyDetail;

// 검색
export type SearchIn = 'title' | 'title_content' | 'content' | 'author';

export type TopCategory = 'study' | 'free' | 'share';

export interface TopWeeklyItem {
  post_id: number;
  title: string;
  category: TopCategory;
  author_id: number;
  total_views_7d: number;
  created_at: string;
}

export interface TopWeeklyResponse {
  category: TopCategory;
  count: number;
  items: TopWeeklyItem[];
}

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
