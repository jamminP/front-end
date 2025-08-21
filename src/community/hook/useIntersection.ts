import { useEffect, useRef } from 'react';

export function useIntersection(callback: () => void, options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) callback();
      });
    }, options);
    io.observe(ref.current);
    return () => io.disconnect();
  }, [callback, options]);

  return ref;
}
