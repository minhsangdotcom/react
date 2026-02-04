import { Storage } from "./IStorage";

import { ENV } from "@config/env";

export const localStorageUtil: Storage = {
  set: function <T>(key: string, value: T): void {
    const prefixKey = `${ENV.storagePrefix}_${key}`;
    try {
      localStorage.setItem(prefixKey, JSON.stringify(value));
    } catch (err) {
      console.warn("localStorage set failed:", err);
    }
  },
  get: function <T>(key: string): T | null {
    const prefixKey = `${ENV.storagePrefix}_${key}`;
    const result = localStorage.getItem(prefixKey);
    if (!result) {
      return null;
    }
    const entity = JSON.parse(result) as T;
    return entity;
  },
  has: function (key: string): boolean {
    return this.get(key) !== null;
  },
  remove: function (key: string): void {
    const prefixKey = `${ENV.storagePrefix}_${key}`;
    localStorage.removeItem(prefixKey);
  },
  clear: function (prefix?: string): void {
    Object.keys(localStorage).forEach((fullKey) => {
      if (fullKey.startsWith(`${prefix}:`)) {
        localStorage.removeItem(fullKey);
      }
    });
  },
};
