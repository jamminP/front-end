// import { useNavigate } from 'react-router-dom';
// import { useCommunityPosts } from '../hook/useCommunityPosts';
// import PostCard from '../components/Postcard';
// import type { Post } from '../api/community';

// const CommunityFree = () => {
//   const navigate = useNavigate();
//   const { data: posts, isLoading } = useCommunityPosts('free');

//   const currentUserId = 723;

//   return (
//     <div className="flex flex-col gap-4 w-full">
//       {isLoading ? (
//         <p className="text-[#0180F5]">불러오는 중...</p>
//       ) : posts && posts.length > 0 ? (
//         posts.map((post: Post) => (
//           <PostCard
//             key={post.postId}
//             post={post}
//             currentUserId={currentUserId}
//             onClick={(id) => navigate(`/community/post/${id}`)}
//           />
//         ))
//       ) : (
//         <p className="text-black">게시글이 없습니다.</p>
//       )}
//     </div>
//   );
// };

// export default CommunityFree;
