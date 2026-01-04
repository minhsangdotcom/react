import { IStorage, ICookieOptions } from "./IStorage";

import { env } from "@config/env";
import Cookies from "js-cookie";

const cookieStorageHelper: IStorage = {
  set: function <T>(key: string, value: T, options?: ICookieOptions): void {
    const prefixKey = `${env.storagePrefix}_${key}`;
    const cookieOptions: Cookies.CookieAttributes = {
      path: options?.path ?? "/",
      domain: options?.domain,
      secure: options?.secure ?? true,
      sameSite: options?.sameSite,
      expires:
        options?.expiresInSeconds && options.expiresInSeconds / (24 * 60 * 60),
    };

    Cookies.set(prefixKey, JSON.stringify(value), cookieOptions);
  },
  get: function <T>(key: string): T | null {
    const prefixKey = `${env.storagePrefix}_${key}`;
    const raw = Cookies.get(prefixKey);
    if (raw == null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      console.warn(
        `CookieStorageHelper: failed to parse cookie "${prefixKey}"`
      );
      return null;
    }
  },
  has: function (key: string): boolean {
    return Cookies.get(key) !== undefined;
  },
  remove: function (key: string): void {
    const prefixKey = `${env.storagePrefix}_${key}`;
    Cookies.remove(prefixKey, { path: "/" });
  },
  clear: function (prefix: string = ""): void {
    const all = Cookies.get(); // returns Record<string, string>
    Object.keys(all).forEach((cookieKey) => {
      if (cookieKey.startsWith(prefix)) {
        Cookies.remove(cookieKey, { path: "/" });
      }
    });
  },
};

export default cookieStorageHelper;
