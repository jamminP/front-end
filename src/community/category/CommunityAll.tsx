import { dummyPosts } from '../__mock__/dummyPost';
import PostCard from '../components/Postcard';

const CommunityAll = () => {
  const handleClick = (id: number) => {
    console.log('게시글 ID:', id);
  };

  return (
    <div className="flex flex-col gap-4">
      {dummyPosts.map((post) => (
        <PostCard key={post.postId} post={post} currentUserId={103} onClick={handleClick} />
      ))}
    </div>
  );
};

export default CommunityAll;

// api 받아오면 적용 예정
// import { useNavigate } from "react-router-dom"
// import CommunityLayout from "../CommunityLayout"
// import PostCard from "../components/PostCard"
// import { useCommunityPosts } from "../hooks/useCommunityPosts"

// const CommunityAll = () => {
//   const navigate = useNavigate()
//   const { data: posts, isLoading, error } = useCommunityPosts("all")
//   const currentUserId = 123 // 예시

//   if (error) return <p className="text-red-500">오류가 발생했습니다</p>

//   return (

//       <div className="flex flex-col gap-4 w-full">
//         {isLoading ? (
//           <p className="text-gray-500">불러오는 중...</p>
//         ) : posts && posts.length > 0 ? (
//           posts.map((post) => (
//             <PostCard
//               key={post.postId}
//               post={post}
//               currentUserId={currentUserId}
//               onClick={(id) => navigate(`/community/post/${id}`)}
//             />
//           ))
//         ) : (
//           <p className="text-gray-400">게시글이 없습니다.</p>
//         )}
//       </div>
//   )
// }

// export default CommunityAll
