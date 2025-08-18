import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FreePostRequest,
  FreePostResponse,
  SharePostRequest,
  SharePostResponse,
  StudyPostRequest,
  StudyPostResponse,
} from '../api/types';
import { createFreePost, createSharePost, createStudyPost } from '../api/community';

export const useCreateFree = () => {
  const queryClient = useQueryClient();
  return useMutation<FreePostResponse, Error, FreePostRequest>({
    mutationFn: (b) => createFreePost(b),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list', 'free'] });
    },
  });
};

export const useCreateShare = () => {
  const queryClient = useQueryClient();
  return useMutation<SharePostResponse, Error, SharePostRequest>({
    mutationFn: (b) => createSharePost(b),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list', 'share'] });
    },
  });
};

export const useCreateStudy = () => {
  const queryClient = useQueryClient();
  return useMutation<StudyPostResponse, Error, StudyPostRequest>({
    mutationFn: (b) => createStudyPost(b),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list', 'study'] });
    },
  });
};
