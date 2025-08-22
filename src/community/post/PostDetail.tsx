import { useParams, Link } from 'react-router-dom';
import { usePostDetail } from '../hook/usePostDetail';
import CommentsBlock from '../post/components/CommentsBlock';
import CommentForm from './components/CommentForm';
import recruiting from '../img/recruiting.png';
import completed from '../img/completed.png';

import type { FreePostResponse, SharePostResponse, StudyPostResponse } from '../api/types';

type Category = 'free' | 'share' | 'study';
const isCategory = (v: string): v is Category => v === 'free' || v === 'share' || v === 'study';

export default function PostDetail() {
  const { category: raw, id } = useParams();
  if (!raw || !id || !isCategory(raw)) return <div className="p-6">잘못된 경로입니다.</div>;

  const category = raw;
  const postId = Number(id);
  const { data, isLoading, isError } = usePostDetail(category, postId);

  if (isLoading) return <div className="p-6 text-center">불러오는 중…</div>;
  if (isError || !data)
    return <div className="p-6 text-center text-red-500">게시글을 불러오지 못했어요.</div>;

  const current_user_id = 0;

  if (data.category === 'study') {
    return <StudyDetail post={data} current_user_id={current_user_id} />;
  }
  if (data.category === 'free' || data.category === 'share') {
    return <BasicDetail post={data} category={data.category} current_user_id={current_user_id} />;
  }

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
      <div className="mt-4 mx-3 border-t border-gray-400/50 bg-none p-5 whitespace-pre-wrap">
        {children}
      </div>
    );
  }
  function Divider() {
    return <div className="my-5 border-t border-gray-400/50" />;
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

  function BasicDetail({
    post,
    category,
    current_user_id,
  }: {
    post: FreePostResponse | SharePostResponse;
    category: 'free' | 'share';
    current_user_id: number;
  }) {
    return (
      <section className="rounded-2xl bg-gray-100 p-5 shadow-md">
        <HeaderBar
          created_at={post.created_at}
          views={post.views}
          rightExtra={<div className="text-sm">❤️ 3</div>}
        />

        <ContentBox>
          <h1 className="mb-3 text-2xl font-bold">{post.title}</h1>
          <p>{post.content}</p>

          {category === 'share' &&
            'files' in post &&
            Array.isArray(post.files) &&
            post.files.length > 0 && (
              <div className="mt-4 rounded-xl border bg-white p-4 text-sm">
                첨부 파일 {post.files.length}개
              </div>
            )}
        </ContentBox>

        <Divider />

        <CommentForm user={post.author_id} postId={post.id} />

        <CommentsBlock post_id={post.id} current_user_id={current_user_id} />
      </section>
    );
  }

  function StudyDetail({
    post,
    current_user_id,
  }: {
    post: StudyPostResponse;
    current_user_id: number;
  }) {
    const meta = post.study_recruitment;
    const badgeIcon =
      post.badge === '모집중' ? recruiting : post.badge === '모집완료' ? completed : null;

    return (
      <section className="rounded-xl bg-gray-100 px-2 py-4 shadow-md">
        <HeaderBar
          created_at={post.created_at}
          views={post.views}
          rightExtra={<div className="text-sm">❤️ 3</div>}
        />

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

        <CommentForm postId={post.id} user={post.author_id} />

        <CommentsBlock post_id={post.id} current_user_id={current_user_id} />
      </section>
    );
  }
}
