import { useMutation } from '@tanstack/react-query';
import { createPostJSON, uploadWithPresignedJson } from '../api/presignedJson';
import { assertUploadLimits, assertFreeTypes, assertShareTypes } from '../utils/upload';

type Payload =
  | { category: 'free'; title: string; content: string; freeImages: File[] }
  | { category: 'share'; title: string; content: string; shareFiles: File[] }
  | {
      category: 'study';
      title: string;
      content: string;
      recruitStart?: string;
      recruitEnd?: string;
      studyStart?: string;
      studyEnd?: string;
      maxMembers?: number;
    };

export function useCreatePost(currentUserId: number) {
  return useMutation({
    mutationFn: async (payload: Payload) => {
      if (payload.category === 'study') {
        const post = await createPostJSON({
          category: 'study',
          title: payload.title,
          content: payload.content,
          recruit_start: payload.recruitStart ?? '',
          recruit_end: payload.recruitEnd ?? '',
          study_start: payload.studyStart ?? '',
          study_end: payload.studyEnd ?? '',
          max_member: payload.maxMembers ?? undefined,
          user_id: currentUserId,
        });
        return post;
      }

      const basePost = await createPostJSON({
        category: payload.category,
        title: payload.title,
        content: payload.content,
        user_id: 1,
      });

      const postId: number = (basePost as any).id ?? (basePost as any).post_id;

      if (payload.category === 'free') {
        const files = payload.freeImages ?? [];
        if (files.length) {
          assertUploadLimits(files);
          assertFreeTypes(files);
          await uploadWithPresignedJson('free', postId, files);
        }
      } else {
        const files = payload.shareFiles ?? [];
        if (files.length) {
          assertUploadLimits(files);
          assertShareTypes(files);
          await uploadWithPresignedJson('share', postId, files);
        }
      }

      return basePost;
    },
  });
}
