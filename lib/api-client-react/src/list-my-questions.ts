import {
  useQuery,
  type QueryFunction,
  type QueryKey,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { customFetch, type ErrorType, type CustomFetchOptions } from "./custom-fetch";
import type { ApiMessage, QuestionList } from "./generated/api.schemas";

export type ListMyQuestionsParams = {
  page?: number;
  pageSize?: number;
};

export const getListMyQuestionsUrl = (params?: ListMyQuestionsParams) => {
  const normalizedParams = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? "null" : value.toString());
    }
  });
  const stringifiedParams = normalizedParams.toString();
  return stringifiedParams.length > 0
    ? `/api/me/questions?${stringifiedParams}`
    : `/api/me/questions`;
};

export const listMyQuestions = async (
  params?: ListMyQuestionsParams,
  options?: RequestInit,
): Promise<QuestionList> => {
  return customFetch<QuestionList>(getListMyQuestionsUrl(params), {
    ...options,
    method: "GET",
  });
};

export const getListMyQuestionsQueryKey = (params?: ListMyQuestionsParams) => {
  return [`/api/me/questions`, ...(params ? [params] : [])] as const;
};

export function useListMyQuestions<
  TData = Awaited<ReturnType<typeof listMyQuestions>>,
  TError = ErrorType<ApiMessage>,
>(
  params?: ListMyQuestionsParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMyQuestions>>, TError, TData>;
    request?: CustomFetchOptions;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey =
    (queryOptions?.queryKey as QueryKey | undefined) ??
    getListMyQuestionsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof listMyQuestions>>> = ({
    signal,
  }) => listMyQuestions(params, { signal, ...requestOptions });

  const merged = {
    queryKey,
    queryFn,
    ...queryOptions,
  } as UseQueryOptions<Awaited<ReturnType<typeof listMyQuestions>>, TError, TData> & {
    queryKey: QueryKey;
  };

  const query = useQuery(merged) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };
  query.queryKey = merged.queryKey;
  return query;
}
