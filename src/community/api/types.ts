export interface FreePostRequestDTO {
  title: string;
  content: string;
  user_id: number;
  category?: 'free';
}
export interface FreeBoardResponseDTO {
  image_url: string | null;
}
export interface FreePostResponseDTO {
  id: number;
  title: string;
  content: string;
  category: 'free';
  author_id: number;
  views: number;
  free_board: FreeBoardResponseDTO;
  created_at: string;
  updated_at: string;
}

export interface SharePostRequestDTO {
  title: string;
  content: string;
  user_id: number;
  file_url?: string | null;
  category?: 'share';
}
export interface DataShareResponseDTO {
  file_url: string | null;
}
export interface SharePostResponseDTO {
  id: number;
  title: string;
  content: string;
  category: 'share';
  author_id: number;
  views: number;
  data_share: DataShareResponseDTO;
  created_at: string;
  updated_at: string;
}

export interface StudyPostRequestDTO {
  title: string;
  content: string;
  user_id: number;
  category?: 'study';
  recruit_start: string; // ISO
  recruit_end: string;
  study_start: string;
  study_end: string;
  max_member: number;
}
export interface StudyRecruitmentResponseDTO {
  recruit_start: string;
  recruit_end: string;
  study_start: string;
  study_end: string;
  max_member: number;
}
export interface StudyPostResponseDTO {
  id: number;
  title: string;
  content: string;
  category: 'study';
  author_id: number;
  views: number;
  study_recruitment: StudyRecruitmentResponseDTO;
  created_at: string;
  updated_at: string;
}

export type FreePostUpdateRequestDTO = Partial<Pick<FreePostRequestDTO, 'title' | 'content'>>;
export type SharePostUpdateRequestDTO = Partial<Pick<SharePostRequestDTO, 'title' | 'content'>> & {
  file_url?: string | null;
};
export type StudyPostUpdateRequestDTO = Partial<
  Pick<
    StudyPostRequestDTO,
    | 'title'
    | 'content'
    | 'recruit_start'
    | 'recruit_end'
    | 'study_start'
    | 'study_end'
    | 'max_member'
  >
>;

export interface CommentRequestDTO {
  post_id: number;
  content: string;
  parent_id?: number | null;
  user_id: number;
}
export interface CommentResponseDTO {
  id: number;
  post_id: number;
  content: string;
  author_id: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
}
