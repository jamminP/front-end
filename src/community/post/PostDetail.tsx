import { useParams, Link, useLocation } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { usePostDetail } from '../hook/usePostDetail';
import CommentsBlock from '../post/components/CommentsBlock';
import recruiting from '../img/recruiting.png';
import completed from '../img/completed.png';
import type { FreeDetail, ShareDetail, StudyDetail } from '../api/types';

type Category = 'free' | 'share' | 'study';
const isCategory = (v: string): v is Category => v === 'free' || v === 'share' || v === 'study';

/** 상세 카드 등장(컨테이너) + 내부 순차 등장을 위한 variants */
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

  if (!raw || !id || !isCategory(raw)) return <div className="p-6">잘못된 경로입니다.</div>;

  const category = raw;
  const postId = Number(id);

  const { data, isLoading, isError } = usePostDetail(category, postId);

  const current_user_id = 18;
  const isAdmin = false;

  // 리스트에서 넘겨준 프리뷰가 있으면 로딩 동안 사용
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

  // ───────────── 렌더 ─────────────
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

  // ───────────────── helpers ─────────────────
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

    const handleEditClick = (e: React.MouseEvent) => e.stopPropagation();
    const handleDeleteClick = (e: React.MouseEvent) => e.stopPropagation();

    // files 안전 처리
    const shareFiles =
      post.category === 'share' && Array.isArray((post as ShareDetail).files)
        ? ((post as ShareDetail).files as NonNullable<ShareDetail['files']>)
        : [];

    return (
      <motion.section
        layout
        layoutId={`post-${layoutKey}`}
        variants={appearContainer}
        initial="hidden"
        animate="show"
        exit={{ opacity: 0, y: 8 }}
        transition={{ layout: { duration: 0.25 } }}
        className="rounded-2xl bg-gray-100 p-5 shadow-md"
      >
        <HeaderBar
          nickname={post.author_nickname}
          created_at={post.created_at}
          views={post.views}
          rightExtra={<div className="text-sm">❤️ {post.like_count ?? 0}</div>}
        />

        {canEdit && (
          <motion.div variants={appearItem} className="flex gap-2 justify-end">
            <button className="text-xs text-black hover:text-[#0180F5]" onClick={handleEditClick}>
              수정
            </button>
            <button className="text-xs text-black hover:text-[#0180F5]" onClick={handleDeleteClick}>
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

          {shareFiles.length > 0 && (
            <motion.div
              variants={appearItem}
              className="mt-4 rounded-xl border bg-white p-4 text-sm"
            >
              첨부 파일 {shareFiles.length}개
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
  }: {
    post: StudyDetail;
    current_user_id: number;
    isAdmin: boolean;
    loading: boolean;
    layoutKey: number;
  }) {
    const canEdit = isAdmin || post.author_id === current_user_id;

    const handleEditClick = (e: React.MouseEvent) => e.stopPropagation();
    const handleDeleteClick = (e: React.MouseEvent) => e.stopPropagation();

    const meta = post.study_recruitment;
    const badgeIcon =
      post.badge === '모집중' ? recruiting : post.badge === '모집완료' ? completed : null;

    return (
      <motion.section
        layout
        layoutId={`post-${layoutKey}`}
        variants={appearContainer}
        initial="hidden"
        animate="show"
        exit={{ opacity: 0, y: 8 }}
        transition={{ layout: { duration: 0.25 } }}
        className="rounded-xl bg-gray-100 px-2 py-4 shadow-md"
      >
        <HeaderBar
          nickname={post.author_nickname}
          created_at={post.created_at}
          views={post.views}
          rightExtra={<div className="text-sm">❤️ {post.like_count ?? 0}</div>}
        />

        {canEdit && (
          <motion.div variants={appearItem} className="flex gap-2 justify-end px-2">
            <button className="text-xs text-black hover:text-[#0180F5]" onClick={handleEditClick}>
              수정
            </button>
            <button className="text-xs text-black hover:text-[#0180F5]" onClick={handleDeleteClick}>
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
              <span>{post.badge}</span>
              {badgeIcon && <img src={badgeIcon} alt={post.badge} className="h-5 w-5" />}
            </div>
            <div>모집 인원 : {meta.max_member}명</div>
            <div>
              모집기간 : {formatDate(meta.recruit_start)} ~ {formatDate(meta.recruit_end)}
            </div>
            <div>
              스터디 기간 : {formatDate(meta.study_start)} ~ {formatDate(meta.study_end)}
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
