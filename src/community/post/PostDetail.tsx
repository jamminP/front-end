import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePostDetail } from '../hook/usePostDetail';
import CommentsBlock from '../post/components/CommentsBlock';
import recruiting from '../img/recruiting.png';
import completed from '../img/completed.png';

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

  return category === 'study' ? (
    <StudyDetail post={data as StudyPost} current_user_id={current_user_id} />
  ) : (
    <BasicDetail
      post={data as FreePost | SharePost}
      category={category}
      current_user_id={current_user_id}
    />
  );
}

type FreePost = {
  id: number;
  title: string;
  content: string;
  category: 'free';
  author_id: string;
  views: number;
  created_at: string;
  updated_at: string;
  free_board?: { image_url: string | null };
};
type SharePost = {
  id: number;
  title: string;
  content: string;
  category: 'share';
  author_id: string;
  views: number;
  created_at: string;
  updated_at: string;
  data_share?: { file_url?: string | null; img_url?: string | null; description?: string | null };
};
type StudyPost = {
  id: number;
  title: string;
  content: string;
  category: 'study';
  author_id: string;
  views: number;
  created_at: string;
  updated_at: string;
  study_recruitment: {
    badge?: string;
    max_member?: number;
    recruit_start?: string;
    recruit_end?: string;
    study_start?: string;
    study_end?: string;
  };
};

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
  post: FreePost | SharePost;
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

        {category === 'share' && 'data_share' in post && post.data_share && (
          <div className="mt-4 rounded-xl border bg-white p-4 text-sm">
            {post.data_share.file_url && (
              <a
                href={post.data_share.file_url}
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                첨부 파일 열기
              </a>
            )}
            {post.data_share.img_url && (
              <div className="mt-3">
                <img
                  alt="공유 이미지"
                  src={post.data_share.img_url}
                  className="max-h-60 rounded-lg object-contain"
                />
              </div>
            )}
            {post.data_share.description && (
              <div className="mt-2 text-gray-600">{post.data_share.description}</div>
            )}
          </div>
        )}
      </ContentBox>

      <Divider />

      <CommentsBlock post_id={post.id} current_user_id={current_user_id} />
    </section>
  );
}

function StudyDetail({ post, current_user_id }: { post: StudyPost; current_user_id: number }) {
  const meta = post.study_recruitment;

  const badgeIcon =
    meta?.badge === '모집중' ? recruiting : meta?.badge === '모집완료' ? completed : null;

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
            <span>{meta?.badge ?? '미정'}</span>
            {badgeIcon && <img src={badgeIcon} alt={meta?.badge ?? '상태'} className="h-5 w-5" />}
          </div>
          <div>모집 인원 : {meta?.max_member ?? '-'}명</div>
          <div>
            모집기간 : {(meta?.recruit_start && formatDate(meta.recruit_start)) || '-'} ~{' '}
            {(meta?.recruit_end && formatDate(meta.recruit_end)) || '-'}
          </div>
          <div>
            스터디 기간 : {(meta?.study_start && formatDate(meta.study_start)) || '-'} ~{' '}
            {(meta?.study_end && formatDate(meta.study_end)) || '-'}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            className="mb-4 w-56 rounded-xl px-5 py-3 text-lg font-semibold shadow-[0_4px_0_#2b3a5a] active:translate-y-[2px] active:shadow-[0_2px_0_#2b3a5a] bg-blue-500 text-white"
            onClick={() => {}}
          >
            신청하기
          </button>
        </div>

        <p>{post.content}</p>
      </ContentBox>

      <Divider />

      <CommentsBlock post_id={post.id} current_user_id={current_user_id} />
    </section>
  );
}
