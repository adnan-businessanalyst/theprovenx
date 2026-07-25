import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const SESSION_KEY = "tp_session_token";

async function memoryFallbackGet(): Promise<string | null> {
  return (globalThis as { __tpSession?: string | null }).__tpSession ?? null;
}

async function memoryFallbackSet(token: string | null): Promise<void> {
  (globalThis as { __tpSession?: string | null }).__tpSession = token;
}

export async function getSessionToken(): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return typeof localStorage !== "undefined"
        ? localStorage.getItem(SESSION_KEY)
        : await memoryFallbackGet();
    }
    return await SecureStore.getItemAsync(SESSION_KEY);
  } catch {
    return memoryFallbackGet();
  }
}

export async function setSessionToken(token: string | null): Promise<void> {
  try {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") {
        if (token) localStorage.setItem(SESSION_KEY, token);
        else localStorage.removeItem(SESSION_KEY);
      } else {
        await memoryFallbackSet(token);
      }
      return;
    }
    if (token) await SecureStore.setItemAsync(SESSION_KEY, token);
    else await SecureStore.deleteItemAsync(SESSION_KEY);
  } catch {
    await memoryFallbackSet(token);
  }
}
