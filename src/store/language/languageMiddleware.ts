import { Middleware } from "@reduxjs/toolkit";
import { selectLanguage } from "./languageSlice";
import { APP_KEY } from "@/config/key";
import { localStorageUtil } from "@/utils/storages/localStorageUtil";

export const languageMiddleware: Middleware = (store) => (next) => (action) => {
  if (selectLanguage.match(action)) {
    localStorageUtil.set<string>(APP_KEY.language, action.payload);
  }

  return next(action);
};
