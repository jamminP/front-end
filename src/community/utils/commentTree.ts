import type { CommentTreeItem } from '../api/community';

export interface CommentNode extends CommentTreeItem {
  children: CommentNode[];
}

export function buildTwoLevelTree(flat: CommentTreeItem[]): CommentNode[] {
  const byId = new Map<number, CommentNode>();
  const roots: CommentNode[] = [];

  flat.forEach((c) => byId.set(c.id, { ...c, children: [] }));

  byId.forEach((node) => {
    if (node.parent_id === null) {
      roots.push(node);
    } else {
      const parent = byId.get(node.parent_id);
      if (parent && parent.parent_id === null) {
        parent.children.push(node);
      }
    }
  });

  roots.forEach((r) => r.children.forEach((child) => (child.children = [])));
  return roots;
}
