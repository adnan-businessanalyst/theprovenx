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

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [bootstrapped, setBootstrapped] = useState(false);

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

  const user = meQuery.isError ? null : meQuery.data;
  const isLoaded = bootstrapped || meQuery.isSuccess || meQuery.isError;
  const isSignedIn = !!user;

  const invalidateAuth = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: getGetAuthMeQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() }),
    ]);
  }, [queryClient]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      await login({ email, password });
      queryClient.clear();
      await invalidateAuth();
    },
    [invalidateAuth, queryClient],
  );

  const signUp = useCallback(
    async (input: {
      email: string;
      password: string;
      username: string;
      displayName: string;
    }) => {
      await register(input);
      queryClient.clear();
      await invalidateAuth();
    },
    [invalidateAuth, queryClient],
  );

  const signOut = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      queryClient.clear();
      await invalidateAuth();
    }
  }, [invalidateAuth, queryClient]);

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
