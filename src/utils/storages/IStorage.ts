export interface Storage {
  set<T>(key: string, value: T, options?: CookieOptions): void;
  get<T>(key: string): T | null;
  has(key: string): boolean;
  remove(key: string): void;
  clear(prefix?: string): void;
}

export interface CookieOptions {
  expiresInSeconds?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}
