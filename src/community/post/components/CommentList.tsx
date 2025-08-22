import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { http } from '../../api/http';

export interface CommentResponse {
  id: number;
  post_id: number;
  content: string;
  author_nickname: string;
  author_id: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface GetCommentsResponse {
  total: number;
  count: number;
  items: CommentResponse[];
}

async function getComments(postId: number): Promise<GetCommentsResponse> {
  return http<GetCommentsResponse>(`/api/v1/community/post/${postId}/comment`);
}

type Props = { postId: number };

export function CommentList({ postId }: Props) {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['community', 'post', postId, 'comments'],
    queryFn: () => getComments(postId),
    staleTime: 30_000,
  });

  const childrenByParent = useMemo(() => {
    const map = new Map<number, CommentResponse[]>();
    const items = data?.items ?? [];
    for (const c of items) {
      const key = c.parent_id ?? 0;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    }
    return map;
  }, [data]);

  const roots = childrenByParent.get(0) ?? [];

  if (isLoading) {
    return <div className="mt-4 text-sm text-gray-500">댓글 불러오는 중…</div>;
  }
  if (isError) {
    return (
      <div className="mt-4 text-sm text-red-500">
        댓글을 불러오지 못했습니다.{' '}
        <button className="underline" onClick={() => refetch()} disabled={isFetching}>
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <section className="mt-6">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold">
          댓글 <span className="text-gray-500 font-normal">({data?.count ?? 0})</span>
        </h3>
        <button
          onClick={() => refetch()}
          className="text-xs px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-60"
          disabled={isFetching}
        >
          {isFetching ? '새로고침…' : '새로고침'}
        </button>
      </header>

      {roots.length === 0 ? (
        <div className="text-sm text-gray-500">아직 댓글이 없습니다.</div>
      ) : (
        <ul className="space-y-4">
          {roots.map((c) => (
            <CommentNode key={c.id} comment={c} childrenByParent={childrenByParent} depth={0} />
          ))}
        </ul>
      )}
    </section>
  );
}

function CommentNode({
  comment,
  childrenByParent,
  depth,
}: {
  comment: CommentResponse;
  childrenByParent: Map<number, CommentResponse[]>;
  depth: number;
}) {
  const children = childrenByParent.get(comment.id) ?? [];
  const ts = safeFormat(comment.created_at);

  return (
    <li>
      <article className="rounded-lg border border-gray-200 p-3">
        <div className="flex items-baseline justify-between gap-3">
          <div className="text-sm font-medium">{comment.author_nickname}</div>
          <time className="text-xs text-gray-500">{ts}</time>
        </div>
        <p className="mt-2 text-sm whitespace-pre-wrap break-words">{comment.content}</p>

        {/* 답글/기능 버튼 자리 (원하면 연결) */}
        {/* <div className="mt-2">
          <button className="text-xs text-gray-600 hover:underline">답글</button>
        </div> */}
      </article>

      {children.length > 0 && (
        <ul className="mt-3 ml-4 border-l pl-4 space-y-3">
          {children.map((child) => (
            <CommentNode
              key={child.id}
              comment={child}
              childrenByParent={childrenByParent}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function safeFormat(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return format(d, 'yyyy.MM.dd HH:mm');
  } catch {
    return iso;
  }
}

export default CommentList;
