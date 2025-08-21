import { useNavigate } from 'react-router-dom';

interface MyPost {
  id: number;
  title: string;
  content: string;
  date: string;
  category: 'free' | 'study' | 'share';
}

export function MyPostCard({ id, title, content, date, category }: MyPost) {
  const navigate = useNavigate();
  return (
    <li
      className="w-[48%] md:w-[32%] h-[130px] text-[#252525] bg-[#ffffff] rounded-2xl mb-[5%] md:mb-[2%] p-[20px] md:p-[25px] border-[1px] border-[#e9e9e9] transform transition-transform duration-300 hover:translate-y-[-5px]"
      onClick={() => navigate(`/community/${category}/${id}`)}
    >
      <h4 className="text-[1.1rem] font-bold tracking-[-.03rem] truncate">{title}</h4>
      <p className="text-[.8rem] text-[#c2c2c2] m-[5px_0] truncate">
        {new Date(date).toLocaleDateString()}
      </p>
      <p className="text-[.9rem] truncate text-[#797979]">{content}</p>
    </li>
  );
}

export function SkeletonCard() {
  return (
    <li className="w-[48%] md:w-[32%] h-[130px] bg-[#f1f1f1] rounded-2xl mb-[5%] md:mb-[2%] animate-pulse"></li>
  );
}
