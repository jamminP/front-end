import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePostDetail } from '../hook/usePostDetail';
import CommentsBlock from '../post/components/CommentsBlock';
import recruiting from '../img/recruiting.png';
import completed from '../img/completed.png';
import type { FreeDetail, ShareDetail, StudyDetail } from '../api/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '../api/community';
import LikeButton from './components/LikeButton';

type Category = 'free' | 'share' | 'study';
const isCategory = (v: string): v is Category => v === 'free' || v === 'share' || v === 'study';

export default function PostDetailPage() {
  const { category: raw, id } = useParams();
  const navigate = useNavigate();
  if (!raw || !id || !isCategory(raw)) return <div className="p-6">잘못된 경로입니다.</div>;

  const category = raw;
  const postId = Number(id);
  const { data, isLoading, isError } = usePostDetail(category, postId);

  const current_user_id = 18;
  const isAdmin = false;

  const qc = useQueryClient();
  const { mutate: removePost, isPending: deletingPost } = useMutation({
    mutationFn: () => deletePost({ post_id: postId, user: current_user_id }),
    onSuccess: () => {
      qc.invalidateQueries({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey.includes('community'),
      });
      navigate(`/community/${category}`);
    },
  });

  const onDeletePost = () => {
    if (window.confirm('게시글을 삭제할까요?')) {
      removePost();
    }
  };

  if (isLoading) return <div className="p-6 text-center">불러오는 중…</div>;
  if (isError || !data)
    return <div className="p-6 text-center text-red-500">게시글을 불러오지 못했어요.</div>;

  if (data.category === 'study') {
    return <StudyDetailView post={data} current_user_id={current_user_id} isAdmin={isAdmin} />;
  }

  return (
    <BasicDetailView
      post={data as FreeDetail | ShareDetail}
      current_user_id={current_user_id}
      isAdmin={isAdmin}
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
      <div className="flex items-start justify-between">
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
      </div>
    );
  }

  function ContentBox({ children }: { children: React.ReactNode }) {
    return (
      <div className="mt-4 mx-2 border-t border-gray-400/50 bg-none p-5 whitespace-pre-wrap">
        {children}
      </div>
    );
  }

  function Divider() {
    return <div className="my-5 border-t mx-2 border-gray-400/50" />;
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
  }: {
    post: FreeDetail | ShareDetail;
    current_user_id: number;
    isAdmin: boolean;
  }) {
    const canEdit = isAdmin || post.author_id === current_user_id;

    const handleEditClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      navigate(`/community/${post.category}/${(post as any).id}/edit`);
    };
    const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onDeletePost();
    };

    return (
      <section className="rounded-2xl bg-gray-100 p-5 shadow-md">
        <HeaderBar
          nickname={post.author_nickname}
          created_at={post.created_at}
          views={post.views}
          rightExtra={<LikeButton post_id={post.id} current_user_id={current_user_id} />}
        />

        {canEdit && (
          <div className="flex gap-2 justify-end">
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
          </div>
        )}

        <ContentBox>
          <h1 className="mb-3 text-2xl font-bold">{post.title}</h1>
          <p>{post.content}</p>

          {post.category === 'share' && Array.isArray(post.files) && post.files.length > 0 && (
            <div className="mt-4 rounded-xl border bg-white p-4 text-sm">
              첨부 파일 {post.files.length}개
            </div>
          )}
        </ContentBox>

        <Divider />
        <CommentsBlock post_id={post.id} current_user_id={current_user_id} />
      </section>
    );
  }

  function StudyDetailView({
    post,
    current_user_id,
    isAdmin,
  }: {
    post: StudyDetail;
    current_user_id: number;
    isAdmin: boolean;
  }) {
    const canEdit = isAdmin || post.author_id === current_user_id;

    const handleEditClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      navigate(`/community/${post.category}/${(post as any).id}/edit`);
    };
    const handleDeleteClick = (e: React.MouseEvent) => e.stopPropagation();

    const meta = post.study_recruitment;
    const badgeIcon =
      post.badge === '모집중' ? recruiting : post.badge === '모집완료' ? completed : null;

    return (
      <section className="rounded-xl bg-gray-100 px-2 py-4 shadow-md">
        <HeaderBar
          nickname={post.author_nickname}
          created_at={post.created_at}
          views={post.views}
          rightExtra={<LikeButton post_id={post.id} current_user_id={current_user_id} />}
        />

        {canEdit && (
          <div className="flex gap-2 justify-end px-2">
            <button className="text-xs text-black hover:text-[#0180F5]" onClick={handleEditClick}>
              수정
            </button>
            <button className="text-xs text-black hover:text-[#0180F5]" onClick={handleDeleteClick}>
              삭제
            </button>
          </div>
        )}

        <ContentBox>
          <h1 className="mb-3 text-2xl font-bold">{post.title}</h1>

          <div className="mb-4 space-y-2 border-y border-gray-400/50 bg-none p-2 text-sm">
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
          </div>

          <p>{post.content}</p>
        </ContentBox>

        <Divider />
        <CommentsBlock post_id={post.id} current_user_id={current_user_id} />
      </section>
    );
  }
}
