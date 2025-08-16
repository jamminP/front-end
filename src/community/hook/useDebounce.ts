import { useEffect, useState } from 'react';

export default function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
  }, [value, delay]);
  return debounced;
}
