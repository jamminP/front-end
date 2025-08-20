import { useState } from 'react';
import CommentForm from './CommentForm';
import type { CommentTreeItem } from '../../api/community';

type NodeWithChildren = CommentTreeItem & { children?: CommentTreeItem[] };

type Props = {
  node: NodeWithChildren;
  postId: number;
  currentUserId: number;
  depth: number;
};

export default function CommentItem({ node, postId, currentUserId, depth }: Props) {
  const [replyOpen, setReplyOpen] = useState(false);
  const isMine = node.author_id === currentUserId;

  return (
    <div className={`bg-gray-100 rounded-xl px-4 py-3 shadow ${depth ? 'ml-8' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-800">user#{node.author_id}</div>
          <div className="text-xs text-gray-500">{node.created_at}</div>
        </div>
        <div className="flex gap-3">
          <button
            className="text-xs text-gray-600 hover:text-[#0180F5]"
            onClick={() => setReplyOpen((v) => !v)}
          >
            답글
          </button>
          {isMine && (
            <>
              <button className="text-xs text-gray-600 hover:text-[#0180F5]">수정</button>
              <button className="text-xs text-gray-600 hover:text-[#0180F5]">삭제</button>
            </>
          )}
        </div>
      </div>

      <div className="mt-2 text-sm whitespace-pre-wrap">{node.content}</div>

      {replyOpen && (
        <div className="mt-2">
          <CommentForm postId={postId} currentUserId={currentUserId} parentId={node.id} />
        </div>
      )}

      {node.children && node.children.length > 0 && (
        <div className="mt-2 space-y-2">
          {node.children.map((ch) => (
            <CommentItem
              key={ch.id}
              node={ch}
              postId={postId}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
