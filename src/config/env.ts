type EnvKey = keyof ImportMetaEnv;

function getEnv(key: EnvKey, fallback?: string): string {
  const value: string | undefined = import.meta.env[key];

  if (!value && fallback === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value ?? fallback!;
}

export const ENV = {
  apiBaseUrl: getEnv("VITE_API_BASE_URL", "http://localhost:8080/api/v1"),
  hostPort: getEnv("VITE_HOST_PORT", "3000"),
  storagePrefix: getEnv("VITE_STORAGE_PREFIX", "theTemplate_"),
} as const;
