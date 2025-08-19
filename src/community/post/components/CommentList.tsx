// import type { CommentTreeItem } from '../../api/community';
// import CommentItem from './CommentItem';

// type Props = {
//   items: CommentTreeItem[];
//   isLoading?: boolean;
//   postId: number;
//   currentUserId: number;
// };

// function buildTree(flat: CommentTreeItem[]): (CommentTreeItem & { children: CommentTreeItem[] })[] {
//   const map = new Map<number, CommentTreeItem & { children: CommentTreeItem[] }>();
//   const roots: (CommentTreeItem & { children: CommentTreeItem[] })[] = [];
//   flat.forEach((c) => map.set(c.id, { ...c, children: [] }));
//   map.forEach((node) => {
//     if (node.parent_id && map.has(node.parent_id)) map.get(node.parent_id)!.children.push(node);
//     else roots.push(node);
//   });
//   roots.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
//   roots.forEach((n) => n.children.sort((a, b) => (a.created_at < b.created_at ? 1 : -1)));
//   return roots;
// }

// export default function CommentList({ items, isLoading, postId, currentUserId }: Props) {
//   if (isLoading) return <div className="p-4 text-sm text-gray-500">댓글 불러오는 중…</div>;
//   const tree = buildTree(items);
//   if (tree.length === 0)
//     return <div className="p-4 text-sm text-gray-500">첫 댓글을 남겨보세요!</div>;

//   return (
//     <div className="space-y-3">
//       {tree.map((n) => (
//         <CommentItem key={n.id} node={n} postId={postId} currentUserId={currentUserId} depth={0} />
//       ))}
//     </div>
//   );
// }

//목 코드
import type { CommentTreeItem } from '../../__mock__/dummyPost';
import CommentItemMock from './CommentItem';

type Props = {
  items: CommentTreeItem[];
  isLoading?: boolean;
  postId: number;
  currentUserId: number;
};

type TreeNode = CommentTreeItem & { children: CommentTreeItem[] };

function buildTree(flat: CommentTreeItem[]): TreeNode[] {
  const map = new Map<number, TreeNode>();
  const roots: TreeNode[] = [];

  flat.forEach((c) => map.set(c.id, { ...c, children: [] }));
  map.forEach((node) => {
    if (node.parent_id === null) {
      roots.push(node);
    } else {
      const parent = map.get(node.parent_id);
      if (parent && parent.parent_id === null) {
        parent.children.push(node);
      }
    }
  });

  roots.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  roots.forEach((n) => n.children.sort((a, b) => (a.created_at < b.created_at ? 1 : -1)));
  return roots;
}

export default function CommentListMock({ items, isLoading, postId, currentUserId }: Props) {
  if (isLoading) return <div className="p-4 text-sm text-gray-500">댓글 불러오는 중…</div>;
  const tree = buildTree(items);
  if (tree.length === 0)
    return <div className="p-2 text-center text-sm text-gray-500">첫 댓글을 남겨보세요!</div>;

  return (
    <div className="space-y-3">
      {tree.map((n) => (
        <CommentItemMock
          key={n.id}
          node={n}
          postId={postId}
          currentUserId={currentUserId}
          depth={0}
        />
      ))}
    </div>
  );
}
