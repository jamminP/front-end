import useAuthStore from '@src/store/authStore';

// component에서 사용되는 hook
export function useResolvedUserId(): number | undefined {
  const storeUserId = useAuthStore((s) => s.user?.id);

  const isLocalhost = window.location.hostname === 'localhost';
  const useTest = String(import.meta.env.VITE_USE_TEST_ID) === 'true';
  const testId = Number(import.meta.env.VITE_TEST_USER_ID);

  if (isLocalhost && useTest && Number.isFinite(testId)) return testId;

  return storeUserId;
}

// 그외에서 사용되는 hook
export function getResolvedUserId(): number | undefined {
  const storeUserId = useAuthStore.getState().user?.id;

  if (typeof window === 'undefined') return storeUserId;

  const isLocalhost = window.location.hostname === 'localhost';
  const useTest = String(import.meta.env.VITE_USE_TEST_ID) === 'true';
  const testId = Number(import.meta.env.VITE_TEST_USER_ID);

  if (isLocalhost && useTest && Number.isFinite(testId)) return testId;
  return storeUserId;
}
