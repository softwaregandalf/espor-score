import { PrismaClient } from '@prisma/client';

export async function listThreads(prisma: PrismaClient) {
  const threads = await prisma.thread.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { nickname: true, avatarUrl: true, role: true } },
      _count: { select: { comments: true } },
      votes: true,
    },
  });

  return threads.map((thread) => ({
    id: thread.id,
    authorId: thread.authorId,
    title: thread.title,
    content: thread.content,
    category: thread.category,
    gameSlug: thread.gameSlug,
    createdAt: thread.createdAt,
    timeAgo: new Date(thread.createdAt).toLocaleDateString(),
    author: thread.author,
    commentCount: thread._count.comments,
    upvotes: thread.votes.reduce((total, vote) => total + vote.value, 0),
  }));
}

export async function createThread(
  prisma: PrismaClient,
  data: {
    title: string;
    content: string;
    category?: string;
    gameSlug?: string;
    authorId: string;
  }
) {
  const newThread = await prisma.thread.create({
    data: {
      title: data.title,
      content: data.content,
      category: data.category || 'general',
      gameSlug: data.gameSlug || 'all',
      authorId: data.authorId,
    },
  });

  await prisma.vote.create({
    data: { value: 1, threadId: newThread.id, userId: data.authorId },
  });

  return newThread;
}

export async function getThreadById(prisma: PrismaClient, threadId: number) {
  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    include: {
      author: { select: { nickname: true, avatarUrl: true, role: true } },
      votes: true,
      comments: {
        orderBy: { createdAt: 'asc' },
        include: {
          author: { select: { nickname: true, avatarUrl: true, role: true } },
        },
      },
    },
  });

  if (!thread) return null;

  return {
    id: thread.id,
    authorId: thread.authorId,
    title: thread.title,
    content: thread.content,
    category: thread.category,
    gameSlug: thread.gameSlug,
    createdAt: thread.createdAt,
    timeAgo: new Date(thread.createdAt).toLocaleDateString(),
    author: thread.author,
    upvotes: thread.votes.reduce((total, vote) => total + vote.value, 0),
    comments: thread.comments.map((c) => ({
      id: c.id,
      authorId: c.authorId,
      content: c.content,
      createdAt: c.createdAt,
      timeAgo: new Date(c.createdAt).toLocaleDateString(),
      author: c.author,
    })),
  };
}

export async function addComment(
  prisma: PrismaClient,
  threadId: number,
  content: string,
  authorId: string
) {
  const newComment = await prisma.comment.create({
    data: { content, threadId, authorId },
    include: { author: { select: { nickname: true, avatarUrl: true, role: true } } },
  });

  return {
    id: newComment.id,
    authorId: newComment.authorId,
    content: newComment.content,
    createdAt: newComment.createdAt,
    timeAgo: new Date(newComment.createdAt).toLocaleDateString(),
    author: newComment.author,
  };
}

export async function voteThread(
  prisma: PrismaClient,
  threadId: number,
  userId: string,
  value: number
) {
  const existingVote = await prisma.vote.findUnique({
    where: { threadId_userId: { threadId, userId } },
  });

  if (existingVote) {
    if (existingVote.value === value) {
      await prisma.vote.delete({ where: { id: existingVote.id } });
    } else {
      await prisma.vote.update({
        where: { id: existingVote.id },
        data: { value },
      });
    }
  } else {
    await prisma.vote.create({
      data: { value, threadId, userId },
    });
  }
}

export async function deleteComment(
  prisma: PrismaClient,
  threadId: number,
  commentId: number,
  userId: string
) {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });

  if (!comment || comment.threadId !== threadId) {
    throw new Error('COMMENT_NOT_FOUND');
  }

  if (comment.authorId !== userId) {
    throw new Error('FORBIDDEN');
  }

  await prisma.comment.delete({ where: { id: commentId } });
}

export async function deleteThread(
  prisma: PrismaClient,
  threadId: number,
  userId: string
) {
  const thread = await prisma.thread.findUnique({ where: { id: threadId } });
  if (!thread) {
    throw new Error('THREAD_NOT_FOUND');
  }

  if (thread.authorId !== userId) {
    throw new Error('FORBIDDEN');
  }

  await prisma.vote.deleteMany({ where: { threadId } });
  await prisma.comment.deleteMany({ where: { threadId } });
  await prisma.thread.delete({ where: { id: threadId } });
}
