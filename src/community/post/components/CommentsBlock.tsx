import { useState } from 'react';
import { useComments, type CommentNode } from '../../hook/useComments';
import type { CommentResponse } from '../../api/types';
import squarePen from '../../img/square-pen.png';

export default function CommentsBlock({
  post_id,
  current_user_id,
}: {
  post_id: number;
  current_user_id: number;
}) {
  const [rootContent, setRootContent] = useState('');

  const { tree, isLoading, isError, createRoot, createReply, reply_to, setReplyTo, creating } =
    useComments(post_id, current_user_id);

  if (isLoading) return <div className="py-6 text-center">댓글 불러오는 중…</div>;
  if (isError)
    return <div className="py-6 text-center text-red-500">댓글을 불러오지 못했어요.</div>;

  return (
    <section className="space-y-4">
      {/* 최상위 댓글 입력 */}
      <div className="rounded-l bg-gray-200/50 p-2">
        <div className="flex items-center gap-3 border-y-1 border-gray-400/50 bg-none px-2 py-1">
          <input
            className="flex-1 outline-none text-sm"
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

      <div className="space-y-3">
        {tree.map((c: CommentNode) => (
          <div key={c.id} className="rounded-2xl bg-gray-200/70 p-4 shadow-sm">
            <CommentHeader
              nickname={c.author_nickname ?? `User#${c.author_id}`}
              created_at={c.created_at}
            />

            <div className="rounded-xl bg-gray-100 p-4 text-sm shadow whitespace-pre-wrap">
              {c.content}
            </div>

            <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
              <button
                className="hover:underline"
                onClick={() => setReplyTo(reply_to === c.id ? null : c.id)}
              >
                {reply_to === c.id ? '답글 취소' : '답글 달기'}
              </button>
            </div>

            {reply_to === c.id && (
              <InlineReplyEditor
                onSubmit={(text) => {
                  if (!text.trim()) return;
                  createReply(c.id, text.trim());
                }}
                submitting={creating}
              />
            )}

            {c.replies.length > 0 && (
              <div className="mt-3 space-y-3 pl-6">
                {c.replies.map((r: CommentResponse) => (
                  <div key={r.id} className="rounded-2xl bg-gray-200/70 p-4 shadow-sm">
                    <CommentHeader
                      nickname={r.author_nickname ?? `User#${r.author_id}`}
                      created_at={r.created_at}
                    />
                    <div className="rounded-xl bg-gray-100 p-4 text-sm shadow whitespace-pre-wrap">
                      {r.content}
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

function CommentHeader({ nickname, created_at }: { nickname: string; created_at: string }) {
  return (
    <div className="mb-2 flex items-start justify-between">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-300" />
        <div>
          <div className="font-semibold">{nickname}</div>
          <div className="text-xs text-gray-500">{formatDate(created_at)}</div>
        </div>
      </div>
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
    <div className="mt-3 rounded-2xl bg-gray-200/70 p-3">
      <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3">
        <input
          className="flex-1 outline-none text-sm"
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
          className="p-2 shadow bg-[#1B3043] text-white rounded disabled:opacity-50"
          disabled={!v.trim() || submitting}
          onClick={() => {
            if (!v.trim()) return;
            onSubmit(v.trim());
            setV('');
          }}
          aria-label="대댓글 전송"
        >
          <img src={squarePen} alt="comment button" className="w-4 h-4" />
        </button>
      </div>
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
