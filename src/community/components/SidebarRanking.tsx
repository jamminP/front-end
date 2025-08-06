import { Link } from "react-router-dom";

interface RankingPost {
  id: number;
  title: string;
}

interface SidebarRankingProps {
  shareTop5?: RankingPost[];
  freeTop5?: RankingPost[];
  studyTop5?: RankingPost[];
}

const SidebarRanking = ({
  shareTop5 = [],
  freeTop5 = [],
  studyTop5 = [],
}: SidebarRankingProps) => {
  return (
    <div className="bg-[#0180F5] text-white p-4 rounded-lg w-[240px] text-sm">
      <div>
        <h2> 자유 게시판 Top 5 </h2>
        <ul>
          {freeTop5.map((post) => (
            <li key={post.id}>
              <Link
                to={`/community/post/${post.id}`}
                className="block bg-white p-2 text-black my-1 rounded-md shadow hover:bg-gray-50"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2> 자료 공유 게시판 Top 5 </h2>
        <ul>
          {shareTop5.map((post) => (
            <li key={post.id}>
              <Link
                to={`/community/post/${post.id}`}
                className="block bg-white p-2 text-black my-1 rounded-md shadow hover:bg-gray-50"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2> 스터디 모집 게시판 Top 5 </h2>
        <ul>
          {studyTop5.map((post) => (
            <li key={post.id}>
              <Link
                to={`/community/post/${post.id}`}
                className="block bg-white p-2 text-black my-1 rounded-md shadow hover:bg-gray-50"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarRanking;
