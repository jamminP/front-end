import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FreePostRequestDTO,
  FreePostResponseDTO,
  SharePostRequestDTO,
  SharePostResponseDTO,
  StudyPostRequestDTO,
  StudyPostResponseDTO,
} from '../api/types';
import { createFreePost, createSharePost, createStudyPost } from '../api/community';

export const useCreateFree = () => {
  const queryClient = useQueryClient();
  return useMutation<FreePostResponseDTO, Error, FreePostRequestDTO>({
    mutationFn: (b) => createFreePost(b),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list', 'free'] });
    },
  });
};

export const useCreateShare = () => {
  const queryClient = useQueryClient();
  return useMutation<SharePostResponseDTO, Error, SharePostRequestDTO>({
    mutationFn: (b) => createSharePost(b),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list', 'share'] });
    },
  });
};

export const useCreateStudy = () => {
  const queryClient = useQueryClient();
  return useMutation<StudyPostResponseDTO, Error, StudyPostRequestDTO>({
    mutationFn: (b) => createStudyPost(b),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list', 'study'] });
    },
  });
};
