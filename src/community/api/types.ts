export type PostCategory = 'all' | 'free' | 'share' | 'study';

export type ItemCategory = 'free' | 'share' | 'study';

///get post detail response body
export interface BasePost {
  id: number;
  title: string;
  constent: string;
  category: ItemCategory;
  author_id: number;
  author_nickname: string;
  views: number;
  like_count: number;
  commentCount: number;
  created_at: string;
  updated_at: string;
}

export interface FreePost extends BasePost {
  category: 'free';
  images: [string];
}

export interface SharePost extends BasePost {
  category: 'share';
  files: [string];
}

export type Badge = '모집중' | '모집완료';

export interface StudyPost extends BasePost {
  category: 'study';
  badge: Badge;
  study_recruitment: {
    recruit_start: string;
    recruit_end: string;
    study_start: string;
    study_end: string;
    max_member: number;
  };
}

export type ListItem = FreePost | SharePost | StudyPost;

// post list

export interface CursorPage<T> {
  items: T[];
  cursor?: number | null;
}

export interface BaseDetail extends BasePost {
  content: string;
  updatedAt: string;
}
export type FreeDetail = BaseDetail & { category: 'free' };
export type ShareDetail = BaseDetail & {
  category: 'share';
  fileUrl?: string | null;
  imgUrl?: string | null;
};
export type StudyDetail = BaseDetail & {
  category: 'study';
  recruitStart?: string | null;
  recruitEnd?: string | null;
  studyStart?: string | null;
  studyEnd?: string | null;
  maxMember?: number | null;
};

export type PostDetail = FreeDetail | ShareDetail | StudyDetail;
