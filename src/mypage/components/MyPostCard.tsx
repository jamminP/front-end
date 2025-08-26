import { useNavigate } from 'react-router-dom';

interface MyPost {
  id: number;
  title: string;
  views: number;
  date: string;
  category: 'free' | 'study' | 'share';
}

export function MyPostCard({ id, title, views, date, category }: MyPost) {
  const navigate = useNavigate();
  return (
    <li
      className="w-[48%] md:w-[32%] h-[130px] text-[#252525] bg-[#ffffff] rounded-2xl mb-[5%] md:mb-[2%] p-[20px] md:p-[25px] border-[1px] border-[#e9e9e9] transform transition-transform duration-300 hover:translate-y-[-5px] cursor-pointer"
      onClick={() => navigate(`/community/${category}/${id}`)}
    >
      <h4 className="text-[1.1rem] font-bold tracking-[-.03rem] truncate">{title}</h4>
      <div className="flex justify-between items-center">
        <p className="text-[.9rem] text-[#c2c2c2] m-[5px_0] truncate">
          작성일 : {new Date(date).toLocaleDateString()}
        </p>
        <p className="text-[.9rem] text-[#c2c2c2] m-[5px_0] truncate">조회수 : {views}</p>
      </div>
    </li>
  );
}

export function SkeletonCard() {
  return (
    <li className="w-[48%] md:w-[32%] h-[130px] bg-[#f1f1f1] rounded-2xl mb-[5%] md:mb-[2%] animate-pulse"></li>
  );
}
