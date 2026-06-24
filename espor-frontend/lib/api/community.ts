import { apiFetch } from '@/lib/api';

type ApiResponse<T> = { success: true; data: T };

export type CommunityThread = {
  id: number;
  authorId: string;
  title: string;
  content: string;
  category: string;
  gameSlug: string;
  createdAt: string;
  timeAgo: string;
  author: { nickname: string; avatarUrl: string | null; role: string };
  commentCount?: number;
  upvotes: number;
  comments?: CommunityComment[];
};

export type CommunityComment = {
  id: number;
  authorId: string;
  content: string;
  createdAt: string;
  timeAgo: string;
  author: { nickname: string; avatarUrl: string | null; role: string };
};

export async function fetchCommunityThreads(): Promise<CommunityThread[]> {
  const res = await apiFetch<ApiResponse<CommunityThread[]>>('/api/community');
  return res.data;
}

export async function createCommunityThread(data: {
  title: string;
  content: string;
  category: string;
  gameSlug: string;
  authorId: string;
}): Promise<void> {
  await apiFetch('/api/community', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchCommunityThread(threadId: string | number): Promise<CommunityThread | null> {
  try {
    const res = await apiFetch<ApiResponse<CommunityThread>>(`/api/community/${threadId}`);
    return res.data;
  } catch {
    return null;
  }
}

export async function postCommunityComment(
  threadId: string | number,
  content: string,
  authorId: string
): Promise<void> {
  await apiFetch(`/api/community/${threadId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content, authorId }),
  });
}

export async function voteCommunityThread(
  threadId: string | number,
  userId: string,
  value: number
): Promise<void> {
  await apiFetch(`/api/community/${threadId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ userId, value }),
  });
}

export async function deleteCommunityThread(
  threadId: string | number,
  userId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    await apiFetch(`/api/community/${threadId}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : undefined,
    };
  }
}

export async function deleteCommunityComment(
  threadId: string | number,
  commentId: number,
  userId: string
): Promise<{ success: boolean; message?: string }> {
  try {
    await apiFetch(`/api/community/${threadId}/comments/${commentId}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : undefined,
    };
  }
}
