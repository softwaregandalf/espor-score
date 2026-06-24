import { apiFetch } from '@/lib/api';

type ProfileResponse = {
  success: true;
  data: {
    stats: { threads: number; comments: number; upvotes: number };
    recentActivity: Array<{
      id: string;
      threadId: number;
      type: 'thread' | 'comment';
      title: string;
      createdAt: string;
      time: string;
      upvotes: number;
    }>;
  };
};

export async function fetchUserProfile(userId: string) {
  const res = await apiFetch<ProfileResponse>(`/api/users/${userId}/profile`);
  return res.data;
}
