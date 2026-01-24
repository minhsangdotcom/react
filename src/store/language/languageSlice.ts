import { LanguageCode } from "@/types/LanguageType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import Config from "@config/keyConfig";
import { DEFAULT_LANGUAGE } from "@config/i18nConfig";
import localStorageHelper from "@/utils/storages/localStorageHelper";
const getInitialLanguage = (): LanguageCode => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE as LanguageCode;
  return (
    (localStorageHelper.get<string>(Config.currentLanguage) as LanguageCode) ??
    DEFAULT_LANGUAGE
  );
};

interface LanguageState {
  code: LanguageCode;
}

const initialState: LanguageState = {
  code: getInitialLanguage(),
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    selectLanguage(state, action: PayloadAction<LanguageCode>) {
      localStorageHelper.set<string>(Config.currentLanguage, action.payload);
      return { ...state, code: action.payload };
    },
  },
});

export const { selectLanguage } = languageSlice.actions;
export default languageSlice.reducer;
