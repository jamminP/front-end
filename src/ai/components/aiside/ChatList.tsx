import { useUnifiedAiFeed } from '@src/ai/hook/useUnifiedAiFeed';
import { HttpError } from '../../api/http';
import { useEffect, useMemo, useRef, useState } from 'react';
import { deleteStudyPlan, getStudyPlanById } from '@src/ai/api/studyPlan';
import { deleteSummary, getSummaryById } from '@src/ai/api/summary';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UNIFIED_AI_FEED_QK } from '@src/ai/hook/useUnifiedAiFeed';
import type { UnifiedItem } from '@src/ai/api/sidebarTitle';
import { FaTrashAlt } from 'react-icons/fa';
import { pickStudyPlanOne, pickSummaryOne } from '@src/ai/api/normalize';
import PlanPreview from './../aimain/PlanPreview';
import Portal from './../Portal';
import { AnimatePresence, useReducedMotion, motion } from 'framer-motion';
import { overlayVar, dialogVar } from '../../utils/modalMotion';
import { parseSummaryOutput } from '../../utils/summaryOutput';

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

  const reduce = useReducedMotion(); // 접근성

  return (
    <AnimatePresence>
      {open && (
        <Portal>
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div
              variants={overlayVar}
              className="absolute inset-0 bg-black/40"
              onClick={onCancel}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              className="relative z-10 w-[min(720px,92vw)] rounded-2xl bg-white p-4 shadow-xl"
              variants={reduce ? undefined : dialogVar}
              {...(reduce
                ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
                : {})}
            >
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
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
                >
                  {busy ? '삭제 중…' : confirmText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  );
}

function DetailModal({
  target,
  onClose,
  onDeleteClick,
}: {
  target: UnifiedItem | null;
  onClose: () => void;
  onDeleteClick: (it: UnifiedItem) => void;
}) {
  const enabled = !!target;
  const reduce = useReducedMotion();

  const q = useQuery({
    enabled,
    queryKey: ['ai-detail', target?.kind, target?.rid],
    queryFn: async () => {
      if (!target) return null;
      if (target.kind === 'plan') {
        const res = await getStudyPlanById(target.rid);
        return { kind: 'plan' as const, row: pickStudyPlanOne(res) };
      }
      const res = await getSummaryById(target.rid, false);
      return { kind: 'summary' as const, row: pickSummaryOne(res) };
    },
  });

  const ymd = (v?: string | null) =>
    v ? (v.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? v.slice(0, 10)) : '';

  return (
    <AnimatePresence>
      {target && (
        <Portal>
          <motion.div
            key={`${target.kind}-${target.rid}`}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div
              variants={overlayVar}
              className="absolute inset-0 bg-black/40"
              onClick={onClose}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              variants={reduce ? undefined : dialogVar}
              {...(reduce
                ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
                : {})}
              className="relative z-10 w-[min(900px,96vw)] max-h-[88vh] rounded-2xl bg-white p-5 shadow-2xl overflow-y-auto
                         [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {target.kind === 'plan' ? '학습 계획' : '자료 요약'} 상세
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDeleteClick(target)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                  >
                    삭제
                  </button>
                  <button
                    onClick={onClose}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
                  >
                    닫기
                  </button>
                </div>
              </div>

              {q.isLoading && <div className="mt-4 text-sm text-slate-500">불러오는 중…</div>}
              {q.isError && (
                <div className="mt-4 text-sm text-rose-600">
                  {(q.error as any)?.message ?? '상세 정보를 불러오지 못했습니다.'}
                </div>
              )}

              {q.data && q.data.kind === 'plan' && q.data.row && (
                <div className="mt-4 space-y-4">
                  <div className="text-sm text-slate-600">
                    <div>
                      <span className="text-slate-500">기간:</span> {ymd(q.data.row.start_date)} ~{' '}
                      {ymd(q.data.row.end_date)}
                    </div>
                    <div>
                      <span className="text-slate-500">챌린지:</span>{' '}
                      {q.data.row.is_challenge ? '예' : '아니요'}
                    </div>
                    <div>
                      <span className="text-slate-500">생성일:</span> {ymd(q.data.row.created_at)}
                    </div>
                  </div>

                  {(() => {
                    try {
                      const first = JSON.parse(q.data.row.output_data);
                      const parsed = typeof first === 'string' ? JSON.parse(first) : first;
                      if (parsed && typeof parsed === 'object') {
                        return (
                          <div className="rounded-2xl ring-1 ring-slate-200 bg-white shadow-sm p-4">
                            <PlanPreview plan={parsed as any} />
                          </div>
                        );
                      }
                    } catch {}
                    return (
                      <pre className="rounded-xl bg-slate-50 p-3 text-xs overflow-auto">
                        {q.data.row.output_data}
                      </pre>
                    );
                  })()}
                </div>
              )}

              {q.data && q.data.kind === 'summary' && q.data.row && (
                <div className="mt-4 space-y-3">
                  <div className="text-sm text-slate-900 font-medium">
                    {q.data.row.title || '제목 없음'}
                  </div>
                  <div className="text-sm text-slate-600">
                    <div>
                      <span className="text-slate-500">형식:</span> {q.data.row.summary_type}
                    </div>
                    <div>
                      <span className="text-slate-500">생성일:</span> {ymd(q.data.row.created_at)}
                    </div>
                    {q.data.row.file_url && (
                      <div className="mt-1">
                        <a
                          href={q.data.row.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          첨부 파일 열기
                        </a>
                      </div>
                    )}
                  </div>

                  {(() => {
                    const parsed = parseSummaryOutput(q.data.row.output_data);
                    if (!parsed) {
                      return (
                        <pre className="rounded-xl bg-slate-50 p-3 text-xs overflow-auto">
                          {q.data.row.output_data}
                        </pre>
                      );
                    }

                    return (
                      <div className="rounded-2xl ring-1 ring-slate-200 bg-white shadow-sm p-4 space-y-3">
                        {parsed.summary && (
                          <p className="text-sm leading-6 text-slate-800">{parsed.summary}</p>
                        )}

                        {parsed.keyPoints && parsed.keyPoints.length > 0 && (
                          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                            {parsed.keyPoints.map((li: string, i: number) => (
                              <li key={i}>{li}</li>
                            ))}
                          </ul>
                        )}
                        {parsed.keywords && parsed.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {parsed.keywords.map((kw: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </motion.div>
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  );
}

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

  const [target, setTarget] = useState<UnifiedItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [detail, setDetail] = useState<UnifiedItem | null>(null);

  const openDelete = (it: UnifiedItem) => setTarget(it);
  const closeDelete = () => (!deleting ? setTarget(null) : null);
  const openDetail = (it: UnifiedItem) => setDetail(it);
  const closeDetail = () => setDetail(null);

  const stripWeekPrefix = (title: string) => {
    let t = (title || '').trim();
    t = t.replace(/^(\d+\s*주(?:\s*차)?\s*[:\-–·]?\s*)+/, '');
    t = t.replace(/^\d+\s*주과정\s*/, '');
    return t.trim();
  };

  const doDelete = async () => {
    if (!target) return;
    setDeleting(true);
    try {
      if (target.kind === 'plan') await deleteStudyPlan(target.rid);
      else await deleteSummary(target.rid);

      await queryClient.invalidateQueries({ queryKey: UNIFIED_AI_FEED_QK, exact: false });
      setTarget(null);
      if (detail && detail.id === target.id) setDetail(null);
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
      <div
        ref={scrollRef}
        className="
        h-[56vh] overflow-y-auto pr-1
        [scrollbar-width:thin]
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-thumb]:bg-slate-200
        [&::-webkit-scrollbar-thumb]:rounded-full
      "
      >
        <ul className="space-y-1">
          {items.map((it) => (
            <li key={it.id} className="group px-2 py-1 rounded flex items-center hover:bg-slate-50">
              <button
                className="flex-1 text-left truncate text-sm text-slate-700"
                title={stripWeekPrefix(it.title)}
                onClick={() => openDetail(it)}
              >
                {stripWeekPrefix(it.title)}
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
          <div className="py-2 text-center text-xs text-slate-500">불러오는 중…</div>
        )}
        {!hasNextPage && !isLoading && (
          <div className="py-2 text-center text-xs text-slate-400">마지막입니다</div>
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

      <DetailModal
        target={detail}
        onClose={closeDetail}
        onDeleteClick={(it) => {
          setDetail(null);
          setTarget(it);
        }}
      />
    </>
  );
}
