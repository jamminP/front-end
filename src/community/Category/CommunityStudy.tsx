// import { useNavigate } from "react-router-dom"
// import type { Post } from "../api/community"
// import PostCard from "../components/Postcard"

// const CommunityStudy = () => {
//     const navigate = useNavigate()
//     const { data: posts, isLoading } = useCommunityPosts("study")

//     const currentUserId = 123

//     return (
//         <div className="flex flex-col gap-4 w-full">
//           {isLoading ? (
//             <p className="text-gray-500">불러오는 중...</p>
//           ) : posts && posts.length > 0 ? (
//             posts.map((post:Post) => (
//               <PostCard
//                 key={post.postId}
//                 post={post}
//                 currentUserId={currentUserId}
//                 onClick={(id) => navigate(`/community/post/${id}`)}
//               />
//             ))
//           ) : (
//             <p className="text-gray-400">스터디 게시글이 없습니다.</p>
//           )}
//         </div>
//     )
//   }
//   export default CommunityStudy
