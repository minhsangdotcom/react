import localStorageHelper from "@utils/storages/localStorageHelper";
import Config from "@config/keyConfig";

export const DEFAULT_LANGUAGE =
  localStorageHelper.get<string>(Config.currentLanguage) ??
  (import.meta.env.VITE_DEFAULT_LANGUAGE as string);

export const SUPPORTED_LANGUAGES = (
  import.meta.env.VITE_SUPPORTED_LANGUAGES as string
)
  .split(",")
  .map((x) => x.trim());
