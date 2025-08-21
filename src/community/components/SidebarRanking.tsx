import { Link } from 'react-router-dom';
import { useTopWeeklyAll } from '../hook/useTopWeekly';
import type { TopWeeklyItem } from '../api/types';

function ItemRow({ idx, item }: { idx: number; item: TopWeeklyItem }) {
  return (
    <li className="flex items-start gap-2 py-1">
      <span className="w-5 text-sm shrink-0 text-gray-500">{idx + 1}.</span>
      <Link
        to={`/community/${item.category}/${item.post_id}`}
        className="truncate hover:underline"
        title={item.title}
      >
        {item.title}
      </Link>
      <span className="ml-auto text-xs text-gray-400">
        {item.total_views_7d.toLocaleString()} views
      </span>
    </li>
  );
}

function Block({
  title,
  items,
  isLoading,
  isError,
}: {
  title: string;
  items?: TopWeeklyItem[];
  isLoading: boolean;
  isError: boolean;
}) {
  return (
    <section className="p-4 rounded-2xl shadow">
      <h3 className="font-semibold mb-2">{title}</h3>
      {isLoading ? (
        <ul className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="h-5 animate-pulse rounded bg-gray-100" />
          ))}
        </ul>
      ) : isError ? (
        <div className="text-sm text-red-500">불러오기에 실패했어요.</div>
      ) : items && items.length > 0 ? (
        <ul>
          {items.slice(0, 5).map((it, i) => (
            <ItemRow key={it.post_id} idx={i} item={it} />
          ))}
        </ul>
      ) : (
        <div className="text-sm text-gray-400">데이터가 없어요.</div>
      )}
    </section>
  );
}

export default function SidebarRanking() {
  const { study, free, share, isLoading, isError } = useTopWeeklyAll(5);

  return (
    <aside className="space-y-4">
      <Block
        title="스터디 TOP 5"
        items={study.data?.items}
        isLoading={study.isLoading}
        isError={!!study.error}
      />
      <Block
        title="자유 TOP 5"
        items={free.data?.items}
        isLoading={free.isLoading}
        isError={!!free.error}
      />
      <Block
        title="자료공유 TOP 5"
        items={share.data?.items}
        isLoading={share.isLoading}
        isError={!!share.error}
      />
    </aside>
  );
}
