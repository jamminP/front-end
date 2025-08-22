import { useParams } from 'react-router-dom';
import { usePostDetail } from '../hook/usePostDetail';

type Category = 'free' | 'share' | 'study';
const isCategory = (v: string): v is Category => v === 'free' || v === 'share' || v === 'study';

export default function CommunityPostDetail() {
  const { category: raw, postId: rawId } = useParams();
  if (!raw || !rawId || !isCategory(raw)) return <div>잘못된 경로입니다.</div>;

  const category = raw;
  const postId = Number(rawId);
  const { data, isLoading, isError } = usePostDetail(category, postId);

  if (isLoading) return <div className="py-10 text-center">불러오는 중…</div>;
  if (isError || !data)
    return <div className="py-10 text-center text-red-500">게시글을 불러오지 못했어요.</div>;

  return (
    <article>
      <h1 className="text-xl font-semibold">{data.title}</h1>
    </article>
  );
}
