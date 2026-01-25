import { localStorageUtil } from "@/utils/storages/localStorageUtil";
import { APP_KEY } from "@/config/key";

export const DEFAULT_LANGUAGE =
  localStorageUtil.get<string>(APP_KEY.language) ??
  (import.meta.env.VITE_DEFAULT_LANGUAGE as string);

export const SUPPORTED_LANGUAGES = (
  import.meta.env.VITE_SUPPORTED_LANGUAGES as string
)
  .split(",")
  .map((x) => x.trim());
