import { LanguageCode } from "@/types/LanguageType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { APP_KEY } from "@/config/key";
import { DEFAULT_LANGUAGE } from "@config/i18nConfig";
import { localStorageUtil } from "@/utils/storages/localStorageUtil";
const getInitialLanguage = (): LanguageCode => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE as LanguageCode;
  return (
    (localStorageUtil.get<string>(APP_KEY.language) as LanguageCode) ??
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
      localStorageUtil.set<string>(APP_KEY.language, action.payload);
      return { ...state, code: action.payload };
    },
  },
});

export const { selectLanguage } = languageSlice.actions;
export default languageSlice.reducer;
