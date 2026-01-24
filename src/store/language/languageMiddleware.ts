import { Middleware } from "@reduxjs/toolkit";
import { selectLanguage } from "./languageSlice";
import Config from "@config/keyConfig";
import localStorageHelper from "@utils/storages/localStorageHelper";

export const languageMiddleware: Middleware =
  (store) => (next) => (action) => {
    if (selectLanguage.match(action)) {
      localStorageHelper.set<string>(Config.currentLanguage, action.payload);
    }

    return next(action);
  };
