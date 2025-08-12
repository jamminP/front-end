// const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

// export async function http<T>(url: string, init: RequestInit = {}): Promise<T> {
//   const method = (init.method ?? 'GET').toUpperCase();
//   const isSimpleGet = method === 'GET' || method === 'HEAD';

//   const headers: Record<string, string> = {
//     Accept: 'application/json',
//     ...(init.headers as Record<string, string> | undefined),
//   };
//   if (!isSimpleGet && !headers['Content-Type']) {
//     headers['Content-Type'] = 'application/json';
//   }

//   const res = await fetch(`${BASE}${url}`, {
//     ...init,
//     method,
//     headers,
//     redirect: 'follow',
//   });

//   if (!res.ok) {
//     const text = await res.text().catch(() => '');
//     throw new Error(`${res.status} ${res.statusText} ${text ? `- ${text}` : ''}`);
//   }
//   if (res.status === 204) return undefined as unknown as T;
//   return (await res.json()) as T;
// }
