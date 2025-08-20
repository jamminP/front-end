import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '../../api/community';

type Props = { postId: number; currentUserId: number; parentId?: number };

export default function CommentForm({ postId, currentUserId, parentId }: Props) {
  const qc = useQueryClient();
  const [value, setValue] = useState('');

  const mut = useMutation({
    mutationFn: () => createComment(postId, value.trim(), currentUserId, parentId),
    onSuccess: () => {
      setValue('');
      qc.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const disabled = mut.isPending || value.trim().length === 0;

  return (
    <div className="bg-gray-50 border rounded-xl p-3">
      <textarea
        className="w-full rounded-md border px-3 py-2 text-sm"
        rows={parentId ? 2 : 3}
        placeholder={parentId ? '답글을 입력하세요' : '댓글을 입력하세요'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={mut.isPending}
      />
      <div className="flex justify-end mt-2">
        <button
          className="px-3 py-1 rounded-lg bg-black text-white text-sm disabled:opacity-60"
          onClick={() => mut.mutate()}
          disabled={disabled}
        >
          {mut.isPending ? '등록 중…' : '등록'}
        </button>
      </div>
    </div>
  );
}
