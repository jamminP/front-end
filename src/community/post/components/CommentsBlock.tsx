import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useComments, type CommentNode } from '../../hook/useComments';
import type { CommentResponse } from '../../api/types';
import { deleteComment, patchComment } from '../../api/community';
import squarePen from '../../img/square-pen.png';
import { FaPen } from 'react-icons/fa';

export default function CommentsBlock({
  post_id,
  current_user_id,
}: {
  post_id: number;
  current_user_id: number;
}) {
  const [rootContent, setRootContent] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const qc = useQueryClient();

  const { tree, isLoading, isError, createRoot, createReply, reply_to, setReplyTo, creating } =
    useComments(post_id);

  // 댓글 수정 (PATCH)
  const { mutate: saveEdit, isPending: saving } = useMutation({
    mutationFn: (vars: { comment_id: number; content: string }) =>
      patchComment(post_id, { comment_id: vars.comment_id }, { content: vars.content }),
    onSuccess: () => {
      setEditingId(null);
      setEditValue('');
      qc.invalidateQueries({ queryKey: ['community', 'comments', post_id] });
    },
  });

  const { mutate: removeComment, isPending: deleting } = useMutation({
    mutationFn: (comment_id: number) => deleteComment({ comment_id, user: current_user_id }),
    onSuccess: () => {
      qc.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey.includes(post_id) &&
          q.queryKey.some((k) => k === 'comments' || k === 'comment' || k === 'commentTree'),
      });
    },
  });

  const startEdit = (id: number, currentContent: string) => {
    setEditingId(id);
    setEditValue(currentContent);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const confirmDelete = (id: number) => {
    if (!window.confirm('댓글을 삭제할까요?')) return;
    if (editingId === id) cancelEdit();
    if (reply_to === id) setReplyTo(null);
    removeComment(id);
  };

  if (isLoading) return <div className="py-6 text-center">댓글 불러오는 중…</div>;
  if (isError)
    return <div className="py-6 text-center text-red-500">댓글을 불러오지 못했어요.</div>;

  return (
    <section className="space-y-4">
      <div className=" bg-gray-200/10 mx-2">
        <div className="flex items-center gap-3 border-y-1 border-gray-400/50 bg-none px-2 py-1">
          <input
            className="flex-1 w-full outline-none text-sm"
            placeholder="댓글을 입력하세요."
            value={rootContent}
            onChange={(e) => setRootContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && rootContent.trim()) {
                createRoot(rootContent.trim());
                setRootContent('');
              }
            }}
          />
          <button
            className="rounded-full p-2 shadow disabled:opacity-50"
            disabled={!rootContent.trim() || creating}
            onClick={() => {
              if (!rootContent.trim()) return;
              createRoot(rootContent.trim());
              setRootContent('');
            }}
            aria-label="전송"
          >
            <img src={squarePen} alt="comment button" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 트리 렌더 */}
      <div className="space-y-3">
        {tree.map((c: CommentNode) => (
          <div key={c.id} className="border-1 border-gray-200 p-4 shadow-sm">
            <CommentHeader
              nickname={c.author_nickname ?? `User#${c.author_id}`}
              created_at={c.created_at}
              rightArea={
                c.author_id === current_user_id && (
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    {editingId !== c.id ? (
                      <>
                        <button
                          className="hover:underline"
                          onClick={() => startEdit(c.id, c.content)}
                        >
                          수정
                        </button>
                        <button
                          className="hover:underline"
                          onClick={() => confirmDelete(c.id)}
                          disabled={deleting}
                        >
                          삭제
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="hover:underline"
                          onClick={() => saveEdit({ comment_id: c.id, content: editValue.trim() })}
                          disabled={!editValue.trim() || saving}
                        >
                          저장
                        </button>
                        <button className="hover:underline" onClick={cancelEdit}>
                          취소
                        </button>
                      </>
                    )}
                  </div>
                )
              }
            />

            {/* 루트 댓글 본문 / 수정 입력 */}
            <div className="rounded-lg border-[0.8px] border-gray-200 bg-gray-100 p-2 text-sm shadow whitespace-pre-wrap">
              {editingId === c.id ? (
                <textarea
                  className="w-full  resize-y p-1 text-sm rounded"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  rows={3}
                />
              ) : (
                c.content
              )}
            </div>

            {/* 답글/액션 */}
            <div className="mt-2 flex justify-end items-center gap-3 pl-1 text-[12px] text-gray-600">
              <button
                className="hover:underline"
                onClick={() => setReplyTo(reply_to === c.id ? null : c.id)}
                disabled={editingId === c.id}
              >
                {reply_to === c.id ? '답글 취소' : '답글 달기'}
              </button>
            </div>

            {/* 대댓글 입력 */}
            {reply_to === c.id && (
              <InlineReplyEditor
                submitting={creating}
                onSubmit={(text) => {
                  if (!text.trim()) return;
                  createReply(c.id, text.trim());
                }}
              />
            )}

            {/* 대댓글 목록 */}
            {c.replies.length > 0 && (
              <div className="mt-2 space-y-3  pl-3">
                {c.replies.map((r: CommentResponse) => (
                  <div
                    key={r.id}
                    className="rounded-lg bg-white border border-gray-100  p-4 shadow-sm"
                  >
                    <CommentHeader
                      nickname={r.author_nickname ?? `User#${r.author_id}`}
                      created_at={r.created_at}
                      rightArea={
                        r.author_id === current_user_id && (
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            {editingId !== r.id ? (
                              <>
                                <button
                                  className="hover:underline"
                                  onClick={() => startEdit(r.id, r.content)}
                                >
                                  수정
                                </button>
                                <button
                                  className="hover:underline"
                                  onClick={() => confirmDelete(r.id)}
                                  disabled={deleting}
                                >
                                  삭제
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="hover:underline"
                                  onClick={() =>
                                    saveEdit({ comment_id: r.id, content: editValue.trim() })
                                  }
                                  disabled={!editValue.trim() || saving}
                                >
                                  저장
                                </button>
                                <button className="hover:underline" onClick={cancelEdit}>
                                  취소
                                </button>
                              </>
                            )}
                          </div>
                        )
                      }
                    />

                    <div className="rounded-xl bg-gray-100 p-4 text-sm shadow whitespace-pre-wrap">
                      {editingId === r.id ? (
                        <textarea
                          className="w-full resize-y border p-2 text-sm rounded"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          rows={3}
                        />
                      ) : (
                        r.content
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function CommentHeader({
  nickname,
  created_at,
  rightArea,
}: {
  nickname: string;
  created_at: string;
  rightArea?: React.ReactNode;
}) {
  return (
    <div className="mb-2 flex items-start justify-between">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-300" />
        <div>
          <div className="font-semibold">{nickname}</div>
          <div className="text-xs text-gray-500">{formatDate(created_at)}</div>
        </div>
      </div>
      {rightArea}
    </div>
  );
}

function InlineReplyEditor({
  onSubmit,
  submitting,
}: {
  onSubmit: (text: string) => void;
  submitting: boolean;
}) {
  const [v, setV] = useState('');
  return (
    <div className="mt-3 flex justify-between border-y border-gray-300">
      <input
        className="pl-2 py-2 outline-none text-sm"
        placeholder="대댓글을 입력하세요."
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && v.trim()) {
            onSubmit(v.trim());
            setV('');
          }
        }}
      />
      <button
        className="p-1 text-black/80 text-sm"
        disabled={!v.trim() || submitting}
        onClick={() => {
          if (!v.trim()) return;
          onSubmit(v.trim());
          setV('');
        }}
        aria-label="대댓글 전송"
      >
        <FaPen />
      </button>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return iso;
  }
}
