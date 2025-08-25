import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Portal({
  children,
  id = 'app-portal',
}: {
  children: React.ReactNode;
  id?: string;
}) {
  const elRef = useRef<HTMLDivElement | null>(null);
  if (!elRef.current) elRef.current = document.createElement('div');

  useEffect(() => {
    const el = elRef.current!;
    el.setAttribute('id', id);
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  }, [id]);

  return createPortal(children, elRef.current!);
}
