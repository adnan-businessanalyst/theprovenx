import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  login,
  register,
  logout as logoutRequest,
  getAuthMe,
  setAuthTokenGetter,
  type User,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getSessionToken, setSessionToken } from "./session";

type AuthContextValue = {
  user: User | null;
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
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setAuthTokenGetter(() => getSessionToken());
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getSessionToken();
        if (!token) {
          if (!cancelled) setUser(null);
          return;
        }
        const me = await getAuthMe();
        if (!cancelled) setUser(me);
      } catch {
        await setSessionToken(null);
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const session = await login({ email, password });
      await setSessionToken(session.token);
      setUser(session.user);
      queryClient.clear();
    },
    [queryClient],
  );

  const signUp = useCallback(
    async (input: {
      email: string;
      password: string;
      username: string;
      displayName: string;
    }) => {
      const session = await register(input);
      await setSessionToken(session.token);
      setUser(session.user);
      queryClient.clear();
    },
    [queryClient],
  );

  const signOut = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // ignore network errors on logout
    } finally {
      await setSessionToken(null);
      setUser(null);
      queryClient.clear();
    }
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user,
      isLoaded,
      isSignedIn: !!user,
      signIn,
      signUp,
      signOut,
    }),
    [user, isLoaded, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
