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
