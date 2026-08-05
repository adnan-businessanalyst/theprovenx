"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  useGetAuthMe,
  getGetAuthMeQueryKey,
  getGetMeQueryKey,
  login,
  register,
  logout as logoutRequest,
  type User,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

type AuthContextValue = {
  user: User | null | undefined;
  isLoaded: boolean;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: {
    email: string;
    password: string;
    username: string;
    displayName: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function isAuthQueryKey(queryKey: readonly unknown[]): boolean {
  const root = queryKey[0];
  return root === "/api/auth/me" || root === "/api/me";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [bootstrapped, setBootstrapped] = useState(false);
  /** Immediate UI override so login/logout don't wait on query refetch races. */
  const [sessionUser, setSessionUser] = useState<User | null | undefined>(
    undefined,
  );

  const meQuery = useGetAuthMe({
    query: {
      queryKey: getGetAuthMeQueryKey(),
      retry: false,
      staleTime: 30_000,
    },
  });

  useEffect(() => {
    if (!meQuery.isFetching && (meQuery.isSuccess || meQuery.isError)) {
      setBootstrapped(true);
    }
  }, [meQuery.isFetching, meQuery.isSuccess, meQuery.isError]);

  // If auth/me never settles (slow/broken proxy), still treat the session as loaded
  // so the navbar can show Sign In instead of an endless skeleton.
  useEffect(() => {
    if (bootstrapped) return;
    const tid = window.setTimeout(() => setBootstrapped(true), 4000);
    return () => window.clearTimeout(tid);
  }, [bootstrapped]);

  // Drop the override once the network query matches the intended session.
  useEffect(() => {
    if (sessionUser === undefined || meQuery.isFetching) return;
    if (sessionUser === null) {
      if (meQuery.isError || meQuery.data == null) {
        setSessionUser(undefined);
      }
      return;
    }
    if (meQuery.data?.id === sessionUser.id) {
      setSessionUser(undefined);
    }
  }, [sessionUser, meQuery.isFetching, meQuery.isError, meQuery.data]);

  const userFromQuery = meQuery.isError ? null : (meQuery.data ?? null);
  const user = sessionUser !== undefined ? sessionUser : userFromQuery;
  const isLoaded =
    sessionUser !== undefined ||
    bootstrapped ||
    meQuery.isSuccess ||
    meQuery.isError;
  const isSignedIn = !!user;

  const seedAuthUser = useCallback(
    (nextUser: User) => {
      queryClient.setQueryData(getGetAuthMeQueryKey(), nextUser);
      queryClient.setQueryData(getGetMeQueryKey(), nextUser);
      setSessionUser(nextUser);
      setBootstrapped(true);
    },
    [queryClient],
  );

  const clearAuthUser = useCallback(() => {
    queryClient.setQueryData(getGetAuthMeQueryKey(), null);
    queryClient.setQueryData(getGetMeQueryKey(), null);
    // Prefer error/empty settled state over "success with null" for signed-out.
    void queryClient.invalidateQueries({ queryKey: getGetAuthMeQueryKey() });
    setSessionUser(null);
    setBootstrapped(true);
  }, [queryClient]);

  const invalidateNonAuth = useCallback(async () => {
    await queryClient.invalidateQueries({
      predicate: (query) => !isAuthQueryKey(query.queryKey),
    });
  }, [queryClient]);

  const invalidateAuth = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: getGetAuthMeQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() }),
    ]);
  }, [queryClient]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const session = await login({ email, password });
      queryClient.clear();
      seedAuthUser(session.user);
      await invalidateNonAuth();
    },
    [invalidateNonAuth, queryClient, seedAuthUser],
  );

  const signUp = useCallback(
    async (input: {
      email: string;
      password: string;
      username: string;
      displayName: string;
    }) => {
      const session = await register(input);
      queryClient.clear();
      seedAuthUser(session.user);
      await invalidateNonAuth();
    },
    [invalidateNonAuth, queryClient, seedAuthUser],
  );

  const signOut = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: getGetAuthMeQueryKey() }),
        queryClient.cancelQueries({ queryKey: getGetMeQueryKey() }),
      ]);
      queryClient.clear();
      clearAuthUser();
      await invalidateNonAuth();
    }
  }, [clearAuthUser, invalidateNonAuth, queryClient]);

  const refresh = useCallback(async () => {
    await invalidateAuth();
  }, [invalidateAuth]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoaded,
      isSignedIn,
      signIn,
      signUp,
      signOut,
      refresh,
    }),
    [user, isLoaded, isSignedIn, signIn, signUp, signOut, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
