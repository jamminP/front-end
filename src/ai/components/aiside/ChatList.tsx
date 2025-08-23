import { UNIFIED_AI_FEED_QK, useUnifiedAiFeed } from '@src/ai/hook/useUnifiedAiFeed';
import { HttpError } from '../../api/http';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { UnifiedItem } from '@src/ai/api/sidebarTitle';
import { deleteStudyPlan } from '@src/ai/api/studyPlan';
import { deleteSummary } from '@src/ai/api/summary';
import { FaTrashAlt } from 'react-icons/fa';

export default function ChatList({ collapsed }: { collapsed: boolean }) {
  if (collapsed) return null;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    userIdReady,
  } = useUnifiedAiFeed();

  const items = useMemo(() => (data?.pages ?? []).flatMap((p) => p.items), [data]);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  // 삭제 모달 상태
  const [target, setTarget] = useState<UnifiedItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const openDelete = (it: UnifiedItem) => setTarget(it);
  const closeDelete = () => (!deleting ? setTarget(null) : null);

  const doDelete = async () => {
    if (!target) return;
    setDeleting(true);
    try {
      if (target.kind === 'plan') await deleteStudyPlan(target.rid);
      else await deleteSummary(target.rid);

      // 목록 무효화하여 새로고침
      await queryClient.invalidateQueries({ queryKey: UNIFIED_AI_FEED_QK, exact: false });
      setTarget(null);
    } catch (e) {
      const msg =
        e instanceof HttpError
          ? e.message
          : ((e as Error)?.message ?? '삭제 처리 중 오류가 발생했습니다.');
      alert(msg);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (!scrollRef.current || !sentinelRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { root: scrollRef.current, rootMargin: '200px 0px 200px 0px' },
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!userIdReady) return <div className="px-2 py-2 text-xs text-gray-500">유저 확인 중…</div>;

  if (isError) {
    const e = error as unknown;
    let msg = '목록을 불러오지 못했습니다.';
    if (e instanceof HttpError) {
      if (e.isNetwork) msg = '네트워크 오류가 발생했습니다.';
      else if (e.status === 404) msg = 'Not Found';
      else if (e.status === 422) msg = '올바른 데이터 형식이 아닙니다.';
      else msg = e.message || msg;
    }
    return <div className="px-2 py-2 text-xs text-red-600">{msg}</div>;
  }

  return (
    <>
      <div ref={scrollRef} className="h-[56vh] overflow-y-auto">
        <ul className="space-y-1">
          {items.map((it) => (
            <li key={it.id} className="group px-2 py-1 rounded hover:bg-gray-50 flex items-center">
              <button className="flex-1 text-left truncate text-sm text-gray-700" title={it.title}>
                {it.title}
              </button>

              <button
                aria-label="삭제"
                title="삭제"
                onClick={() => openDelete(it)}
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1.5 rounded hover:bg-rose-50 text-rose-600"
              >
                <FaTrashAlt size={14} />
              </button>
            </li>
          ))}
        </ul>
        <div ref={sentinelRef} />
        {(isLoading || isFetchingNextPage) && (
          <div className="py-2 text-center text-xs text-gray-500">불러오는 중…</div>
        )}
        {!hasNextPage && !isLoading && (
          <div className="py-2 text-center text-xs text-gray-400">마지막입니다</div>
        )}
      </div>

      <ConfirmModal
        open={!!target}
        busy={deleting}
        title="정말로 삭제하시겠어요?"
        description={
          target
            ? `${target.kind === 'plan' ? '학습 계획' : '자료 요약'}: “${target.title}”`
            : undefined
        }
        onConfirm={doDelete}
        onCancel={closeDelete}
        confirmText="삭제"
        cancelText="취소"
      />
    </>
  );
}

function ConfirmModal({
  open,
  title,
  description,
  confirmText = '삭제',
  cancelText = '취소',
  onConfirm,
  onCancel,
  busy,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 w-[min(420px,92vw)] rounded-2xl bg-white p-4 shadow-xl">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
            disabled={busy}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={
              'px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60'
            }
          >
            {busy ? '삭제 중…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
