import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import createPostIcon from '../img/pen-line.png';

type Cat = 'free' | 'share' | 'study';

interface Props {
  category: Cat;
  to?: string;
  as?: 'button' | 'link';
  className?: string;
  extraQuery?: Record<string, string | number | undefined>;
}

export const baseClass =
  'px-2 py-2 bg-white rounded-xl shadow hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed';

function buildHref(to: string, params: Record<string, string | number | undefined>) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') qs.set(k, String(v));
  });
  const sep = to.includes('?') ? '&' : '?';
  const query = qs.toString();
  return query ? `${to}${sep}${query}` : to;
}

const CreatePostButton: React.FC<Props> = ({
  category,
  to = 'create',
  as = 'button',
  className,
  extraQuery,
}) => {
  const navigate = useNavigate();
  const href = buildHref(to, { category, ...(extraQuery || {}) });

  const Inner = (
    <span className="inline-flex h-full w-full items-center justify-center">
      <img
        src={createPostIcon}
        alt="새 글 작성"
        className="w-5 h-5 md:w-6 md:h-6 pointer-events-none"
      />
    </span>
  );

  if (as === 'link') {
    return (
      <Link to={href} className={`${baseClass} ${className ?? ''}`} aria-label="새 글 작성">
        {Inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => navigate(href)}
      className={`${baseClass} ${className ?? ''}`}
      aria-label="새 글 작성"
    >
      {Inner}
    </button>
  );
};

export default CreatePostButton;
