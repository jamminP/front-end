import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { usePostDetail } from '../hook/usePostDetail';
import CommentsBlock from '../post/components/CommentsBlock';
import recruiting from '../img/recruiting.png';
import completed from '../img/completed.png';
import type { FreeDetail, ShareDetail, StudyDetail } from '../api/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applyStudy, deletePost, normalizeFiles } from '../api/community';
import LikeButton from './components/LikeButton';
import useAuthStore from '@src/store/authStore';
import { useEffect, useState } from 'react';

type Category = 'free' | 'share' | 'study';
const isCategory = (v: string): v is Category => v === 'free' || v === 'share' || v === 'study';

const appearContainer: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, when: 'beforeChildren', staggerChildren: 0.05 },
  },
};
const appearItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

export default function PostDetailPage() {
  const { category: raw, id } = useParams();
  const { state } = useLocation() as {
    state?: { post?: Partial<StudyDetail | FreeDetail | ShareDetail> };
  };
  const navigate = useNavigate();

  if (!raw || !id || !isCategory(raw)) return <div className="p-6">잘못된 경로입니다.</div>;

  const category = raw;
  const postId = Number(id);

  const { data, isLoading, isError, refetch } = usePostDetail(category, postId);

  const current_user = useAuthStore((s) => s.user!);
  const current_user_id = current_user.id;
  const isAdmin = false;

  const qc = useQueryClient();
  const { mutate: onDeletePost, isPending: deletingPost } = useMutation({
    mutationFn: () => deletePost({ post_id: postId, user: current_user_id }),
    onSuccess: () => {
      qc.invalidateQueries({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey.includes('community'),
      });
      navigate(`/community/${category}`);
    },
  });

  const preview = state?.post ?? {};
  const base = {
    id: postId,
    title: preview.title ?? '',
    author_id: (preview as any).author_id ?? 0,
    author_nickname: (preview as any).author_nickname ?? '',
    category,
    content: preview.content ?? '',
    created_at: (preview as any).created_at ?? new Date().toISOString(),
    views: (preview as any).views ?? 0,
    like_count: (preview as any).like_count ?? 0,
    comment_count: (preview as any).comment_count ?? 0,
  };

  if (isError) {
    return (
      <motion.section
        layout
        layoutId={`post-${postId}`}
        variants={appearContainer}
        initial="hidden"
        animate="show"
        exit={{ opacity: 0, y: 8 }}
        className="rounded-2xl bg-gray-100 p-5 shadow-md"
      >
        <div className="p-6 text-center text-red-500">게시글을 불러오지 못했어요.</div>
      </motion.section>
    );
  }

  if (category === 'study') {
    const post: StudyDetail = (data ??
      ({
        ...base,
        badge: (preview as any).badge ?? '',
        study_recruitment: {
          max_member: (preview as any)?.study_recruitment?.max_member ?? 0,
          recruit_start: (preview as any)?.study_recruitment?.recruit_start ?? '',
          recruit_end: (preview as any)?.study_recruitment?.recruit_end ?? '',
          study_start: (preview as any)?.study_recruitment?.study_start ?? '',
          study_end: (preview as any)?.study_recruitment?.study_end ?? '',
        },
      } as any)) as StudyDetail;

    return (
      <StudyDetailView
        post={post}
        current_user_id={current_user_id}
        isAdmin={isAdmin}
        loading={isLoading}
        layoutKey={postId}
        refetchDetail={refetch}
      />
    );
  }

  const postBasic: FreeDetail | ShareDetail = (data ?? (base as any)) as FreeDetail | ShareDetail;

  return (
    <BasicDetailView
      post={postBasic}
      current_user_id={current_user_id}
      isAdmin={isAdmin}
      loading={isLoading}
      layoutKey={postId}
    />
  );

  function HeaderBar(props: {
    nickname?: string;
    created_at: string;
    views: number;
    rightExtra?: React.ReactNode;
  }) {
    const { nickname = 'NickName', created_at, views, rightExtra } = props;
    return (
      <motion.div variants={appearItem} className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-300 shrink-0" />
          <div>
            <div className="text-lg font-semibold">{nickname}</div>
            <div className="text-xs text-gray-500">
              {formatDate(created_at)} <span className="mx-1">·</span> 조회수 {views}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {rightExtra}
          <Link to=".." className="text-lg">
            ×
          </Link>
        </div>
      </motion.div>
    );
  }

  function ContentBox({ children }: { children: React.ReactNode }) {
    return (
      <motion.div
        variants={appearItem}
        className="mt-4 mx-2 border-t border-gray-400/50 bg-none p-5 whitespace-pre-wrap"
      >
        {children}
      </motion.div>
    );
  }

  function Divider() {
    return <motion.div variants={appearItem} className="my-5 border-t mx-2 border-gray-400/50" />;
  }

  function formatDate(iso: string) {
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(d);
    } catch {
      return iso;
    }
  }

  function formatBytes(bytes: number) {
    if (!Number.isFinite(bytes)) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let v = bytes;
    let i = 0;
    while (v >= 1024 && i < units.length - 1) {
      v /= 1024;
      i++;
    }
    return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
  }

  function BasicDetailView({
    post,
    current_user_id,
    isAdmin,
    loading,
    layoutKey,
  }: {
    post: FreeDetail | ShareDetail;
    current_user_id: number;
    isAdmin: boolean;
    loading: boolean;
    layoutKey: number;
  }) {
    const canEdit = isAdmin || post.author_id === current_user_id;

    const handleEditClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      navigate(`/community/${post.category}/${(post as any).id}/edit`);
    };
    const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (window.confirm('게시글을 삭제할까요?')) onDeletePost();
    };

    const shareFiles = post.category === 'share' ? normalizeFiles((post as ShareDetail).files) : [];
    const freeImages = post.category === 'free' ? ((post as FreeDetail).images ?? []) : [];

    return (
      <motion.section
        layout
        layoutId={`post-${layoutKey}`}
        variants={appearContainer}
        initial="hidden"
        animate="show"
        exit={{ opacity: 0, y: 8 }}
        transition={{ layout: { duration: 0.25 } }}
        className="rounded-2xl border-[0.8px] border-gray-200 bg-white p-5 shadow-lg"
      >
        <HeaderBar
          nickname={post.author_nickname}
          created_at={post.created_at}
          views={post.views}
          rightExtra={<LikeButton post_id={post.id} />}
        />

        {canEdit && (
          <motion.div variants={appearItem} className="flex gap-2 justify-end">
            <button className="text-xs text-black hover:text-[#0180F5]" onClick={handleEditClick}>
              수정
            </button>
            <button
              className="text-xs text-black hover:text-[#0180F5]"
              onClick={handleDeleteClick}
              disabled={deletingPost}
            >
              삭제
            </button>
          </motion.div>
        )}

        <ContentBox>
          <motion.h1
            layoutId={`post-title-${layoutKey}`}
            variants={appearItem}
            className="mb-3 text-2xl font-bold"
          >
            {post.title || (loading ? '제목 불러오는 중…' : '')}
          </motion.h1>

          {loading ? (
            <motion.div
              variants={appearItem}
              className="h-20 rounded-md bg-gray-200/70 animate-pulse"
            />
          ) : (
            <motion.p variants={appearItem}>{post.content}</motion.p>
          )}

          {post.category === 'free' && freeImages.length > 0 && (
            <motion.div variants={appearItem} className="mt-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {freeImages.map((img) => (
                  <div key={img.id} className="overflow-hidden rounded-sm">
                    <img
                      src={img.image_url}
                      alt="첨부 이미지"
                      className="w-full h-auto block"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {post.category === 'share' && shareFiles.length > 0 && (
            <motion.div variants={appearItem} className="mt-4 space-y-2">
              <div className="text-sm text-gray-600">첨부 파일 {shareFiles.length}개</div>
              <ul className="divide-y rounded-lg">
                {shareFiles.map((f) => {
                  const isPdf =
                    f.mime_type === 'application/pdf' || f.file_url.toLowerCase().endsWith('.pdf');
                  return (
                    <li key={f.id} className="p-3 flex items-center justify-between">
                      <div className="min-w-0 pr-3">
                        <div className="truncate text-sm">
                          {isPdf ? 'PDF' : '파일'}&nbsp;
                          <a
                            href={f.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:opacity-80"
                            download
                          >
                            {f.file_url.split('/').pop()}
                          </a>
                        </div>
                        <div className="text-xs text-gray-500">
                          {f.mime_type} · {formatBytes(f.size_bytes)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={f.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs rounded-md border px-2 py-1 hover:bg-gray-50"
                        >
                          새 탭에서 열기
                        </a>
                        <a
                          href={f.file_url}
                          download
                          className="text-xs rounded-md border px-2 py-1 hover:bg-gray-50"
                        >
                          다운로드
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </ContentBox>

        <Divider />
        {!loading && (
          <motion.div variants={appearItem}>
            <CommentsBlock post_id={post.id} current_user_id={current_user_id} />
          </motion.div>
        )}
      </motion.section>
    );
  }

  function StudyDetailView({
    post,
    current_user_id,
    isAdmin,
    loading,
    layoutKey,
    refetchDetail,
  }: {
    post: StudyDetail;
    current_user_id: number;
    isAdmin: boolean;
    loading: boolean;
    layoutKey: number;
    refetchDetail: () => Promise<any>;
  }) {
    const navigate = useNavigate();
    const canEdit = isAdmin || post.author_id === current_user_id;

    const handleEditClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      navigate(`/community/${post.category}/${(post as any).id}/edit`);
    };
    const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (window.confirm('게시글을 삭제할까요?')) onDeletePost();
    };

    const meta = post.study_recruitment;
    const badgeIcon =
      post.badge === '모집중' ? recruiting : post.badge === '모집완료' ? completed : null;

    const { applied, setApplied, markApplied, isChecking } = useAppliedPersistence(
      post.id,
      current_user_id,
    );

    const { mutateAsync: doApply, isPending: applying } = useMutation({
      mutationFn: () => applyStudy({ post_id: post.id, user: current_user_id }),
    });

    const canApply =
      applied === false && post.badge === '모집중' && post.author_id !== current_user_id;

    return (
      <motion.section
        layout
        layoutId={`post-${layoutKey}`}
        variants={appearContainer}
        initial="hidden"
        animate="show"
        exit={{ opacity: 0, y: 8 }}
        transition={{ layout: { duration: 0.25 } }}
        className="rounded-xl bg-white border-[0.8px] border-gray-200 px-2 py-4 shadow-lg"
      >
        <HeaderBar
          nickname={post.author_nickname}
          created_at={post.created_at}
          views={post.views}
          rightExtra={<LikeButton post_id={post.id} />}
        />

        {canEdit && (
          <motion.div variants={appearItem} className="flex gap-2 justify-end px-2">
            <button className="text-xs text-black hover:text-[#0180F5]" onClick={handleEditClick}>
              수정
            </button>
            <button
              className="text-xs text-black hover:text-[#0180F5]"
              onClick={handleDeleteClick}
              disabled={deletingPost}
            >
              삭제
            </button>
          </motion.div>
        )}

        <ContentBox>
          <motion.h1
            layoutId={`post-title-${layoutKey}`}
            variants={appearItem}
            className="mb-3 text-2xl font-bold"
          >
            {post.title || (loading ? '제목 불러오는 중…' : '')}
          </motion.h1>

          <motion.div
            variants={appearItem}
            className="mb-4 space-y-2 border-y border-gray-400/50 bg-none p-2 text-sm"
          >
            <div className="flex items-center gap-2">
              <span>모집 상태 :</span>
              <span className="inline-flex items-center gap-2">
                {badgeIcon && <img src={badgeIcon} className="h-4" />} {post.badge}
              </span>
            </div>
            <div>모집 인원 : {meta.max_member}명</div>
            <div>
              모집기간 : {formatDate(meta.recruit_start)} ~ {formatDate(meta.recruit_end)}
            </div>
            <div>
              스터디 기간 : {formatDate(meta.study_start)} ~ {formatDate(meta.study_end)}
            </div>
            <div>
              <button
                type="button"
                className={`px-3 py-1 w-60 rounded ${
                  canApply
                    ? 'bg-black text-white hover:opacity-80'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                disabled={loading || applying || !canApply || isChecking}
                onClick={async () => {
                  if (!canApply) return;
                  markApplied();
                  try {
                    await doApply();
                    await refetchDetail();
                    alert('신청이 접수되었어요.');
                  } catch {
                    setApplied(false);
                    saveAppliedToStorage(post.id, current_user_id, false);
                    alert('신청에 실패했습니다. 다시 시도해주세요.');
                  }
                }}
              >
                {isChecking ? '확인 중…' : applied ? '신청완료' : '신청하기'}
              </button>
            </div>
          </motion.div>

          {loading ? (
            <motion.div
              variants={appearItem}
              className="h-24 rounded-md bg-gray-200/70 animate-pulse"
            />
          ) : (
            <motion.p variants={appearItem}>{post.content}</motion.p>
          )}
        </ContentBox>

        <Divider />
        {!loading && (
          <motion.div variants={appearItem}>
            <CommentsBlock post_id={post.id} current_user_id={current_user_id} />
          </motion.div>
        )}
      </motion.section>
    );
  }
}

/** -----------------------------
 *  사용자별 로컬스토리지 헬퍼
 *  ----------------------------*/
function appliedKey(userId: number) {
  return `community:study-applied:${userId}`;
}

function loadAppliedFromStorage(postId: number, userId: number): boolean {
  try {
    const raw = localStorage.getItem(appliedKey(userId));
    if (!raw) return false;
    const map = JSON.parse(raw) as Record<string, boolean>;
    return !!map[String(postId)];
  } catch {
    return false;
  }
}

function saveAppliedToStorage(postId: number, userId: number, val: boolean) {
  try {
    const key = appliedKey(userId);
    const raw = localStorage.getItem(key);
    const map = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    if (val) map[String(postId)] = true;
    else delete map[String(postId)];
    localStorage.setItem(key, JSON.stringify(map));
  } catch {}
}

/** -----------------------------
 *  신청 상태 훅 (초기값 null)
 *  ----------------------------*/
function useAppliedPersistence(postId: number, userId: number) {
  // null: 서버 확인중
  const [applied, setApplied] = useState<boolean | null>(null);

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        const res = await fetch(`/api/v1/community/post/${postId}/study-application`, {
          credentials: 'include',
        });
        if (aborted) return;
        if (res.status === 200) {
          setApplied(true);
          saveAppliedToStorage(postId, userId, true);
        } else if (res.status === 404) {
          setApplied(false);
          saveAppliedToStorage(postId, userId, false);
        } else {
          // 예상치 못한 상태코드면 안전하게 false로
          setApplied(false);
        }
      } catch {
        // 네트워크 오류 시 로컬 기준으로 추정
        setApplied(loadAppliedFromStorage(postId, userId));
      }
    })();
    return () => {
      aborted = true;
    };
  }, [postId, userId]);

  const markApplied = () => {
    setApplied(true);
    saveAppliedToStorage(postId, userId, true);
  };

  return { applied, setApplied, markApplied, isChecking: applied === null };
}
