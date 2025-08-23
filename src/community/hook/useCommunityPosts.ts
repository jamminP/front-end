import { useMutation } from '@tanstack/react-query';
import { createFreePost, createSharePost, createStudyPost, type ApiId } from '../api/community';

export const useCreateFree = () =>
  useMutation<ApiId, Error, any>({
    mutationFn: createFreePost,
  });

export const useCreateShare = () =>
  useMutation<ApiId, Error, any>({
    mutationFn: createSharePost,
  });

export const useCreateStudy = () =>
  useMutation<ApiId, Error, any>({
    mutationFn: createStudyPost,
  });
