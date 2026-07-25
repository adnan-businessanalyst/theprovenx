import OpenAI from "openai";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} must be set. Did you forget to provision the OpenAI AI integration?`,
    );
  }
  return value;
}

let _openai: OpenAI | null = null;

/** Lazy client so the API can boot without AI env vars until translate is used. */
export function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: requireEnv("AI_INTEGRATIONS_OPENAI_API_KEY"),
      baseURL: requireEnv("AI_INTEGRATIONS_OPENAI_BASE_URL"),
    });
  }
  return _openai;
}

/** Back-compat export — resolves on first property access. */
export const openai: OpenAI = new Proxy({} as OpenAI, {
  get(_target, prop, receiver) {
    const client = getOpenAI();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
