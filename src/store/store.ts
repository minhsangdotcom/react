import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@features/auth/authSlice";
import profileProducer from "@features/profile/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileProducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
