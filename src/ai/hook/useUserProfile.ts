import useAuthStore from '@src/store/authStore';

export function useResolvedNickname(): string {
  const storeNickname = useAuthStore((s) => s.user?.nickname);

  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const useTest = String(import.meta.env.VITE_USE_TEST_ID) === 'true';
  const testNickname = (import.meta.env.VITE_TEST_NICKNAME ?? '') as string;

  if (isLocalhost && useTest && testNickname.trim()) return testNickname.trim();

  return storeNickname?.trim() || '게스트';
}
