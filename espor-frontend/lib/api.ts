export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  } catch {
    throw new Error('API bağlantısı kurulamadı.');
  }

  let json: { success?: boolean; message?: string; data?: unknown };
  try {
    json = await res.json();
  } catch {
    throw new Error('API yanıtı okunamadı.');
  }

  if (!res.ok || json.success === false) {
    throw new Error(json.message || 'API isteği başarısız.');
  }

  return json as T;
}
