import { getApiBaseUrl } from "./site";

export async function fetchApi<T>(
  path: string,
  init?: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } },
): Promise<T | null> {
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
      next: init?.next ?? { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export type QuestionMeta = {
  slug: string;
  title: string;
  body: string;
  updatedAt: string;
  author: { username: string; displayName?: string | null };
};

export type UserMeta = {
  username: string;
  displayName?: string | null;
  bio?: string | null;
  reputation?: number;
};

export type QuestionDetailMeta = {
  question: {
    slug: string;
    title: string;
    body: string;
    score: number;
    createdAt: string;
    updatedAt: string;
    author: { username: string; displayName?: string | null };
  };
  answers: {
    body: string;
    score: number;
    isAccepted: boolean;
    createdAt: string;
    author: { username: string; displayName?: string | null };
  }[];
};

export async function fetchQuestionDetail(slug: string): Promise<QuestionDetailMeta | null> {
  return fetchApi<QuestionDetailMeta>(
    `/api/questions/${encodeURIComponent(slug)}`,
    { next: { revalidate: 120 } },
  );
}

export async function fetchQuestionMeta(slug: string): Promise<QuestionMeta | null> {
  const data = await fetchApi<{ question: QuestionMeta }>(
    `/api/questions/${encodeURIComponent(slug)}`,
    { next: { revalidate: 120 } },
  );
  return data?.question ?? null;
}

export async function fetchUserMeta(username: string): Promise<UserMeta | null> {
  return fetchApi<UserMeta>(`/api/users/${encodeURIComponent(username)}`, {
    next: { revalidate: 120 },
  });
}

export async function fetchSitemapEntries(): Promise<{
  questions: { slug: string; updatedAt?: string }[];
  users: { username: string }[];
}> {
  const questions =
    (await fetchApi<{ items: { slug: string; updatedAt?: string }[] }>(
      "/api/questions?pageSize=100&sort=newest",
      { next: { revalidate: 3600 } },
    )) ?? { items: [] };

  const top =
    (await fetchApi<{ username: string }[]>("/api/users/top?limit=100", {
      next: { revalidate: 3600 },
    })) ?? [];

  return {
    questions: questions.items ?? [],
    users: top.map((u) => ({ username: u.username })),
  };
}
