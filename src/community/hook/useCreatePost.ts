import { useMutation } from '@tanstack/react-query';
import { createPost, uploadAndAttach } from '../api/communityUpload';
import { assertUploadLimits, assertFreeTypes, assertShareTypes } from '../utils/upload';

type Payload =
  | ({ category: 'free' } & { title: string; content: string; freeImages: File[] })
  | ({ category: 'share' } & { title: string; content: string; shareFiles: File[] })
  | ({ category: 'study' } & {
      title: string;
      content: string;
      recruitStart?: string;
      recruitEnd?: string;
      studyStart?: string;
      studyEnd?: string;
      maxMembers?: number;
    });

export function useCreatePost() {
  return useMutation({
    mutationFn: async (payload: Payload) => {
      const post = await createPost(payload as any);
      const postId = (post as any).post_id;

      if (payload.category === 'free') {
        const files = payload.freeImages ?? [];
        if (files.length) {
          assertUploadLimits(files);
          assertFreeTypes(files);
          await uploadAndAttach({ category: 'free', postId, files });
        }
      } else if (payload.category === 'share') {
        const files = payload.shareFiles ?? [];
        if (files.length) {
          assertUploadLimits(files);
          assertShareTypes(files);
          await uploadAndAttach({ category: 'share', postId, files });
        }
      }
      return post;
    },
  });
}
