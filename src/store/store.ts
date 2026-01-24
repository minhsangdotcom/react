import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@features/auth/authSlice";
import profileProducer from "@features/profile/profileSlice";
import languageReducer from "./language/languageSlice";
import { languageMiddleware } from "./language/languageMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileProducer,
    language: languageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(languageMiddleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
