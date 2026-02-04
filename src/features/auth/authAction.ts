import authService from "@/features/auth/authService";
import { LoginRequest } from "@features/auth/ILoginRequest";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginAsync = createAsyncThunk(
  "user/login",
  async (credentials: LoginRequest, thunkAPI) => {
    const response = await authService.login(credentials);

    if (!response.success) {
      const errorResult = response.error!;
      return thunkAPI.rejectWithValue(errorResult);
    }

    return response;
  }
);

export const refreshAsync = createAsyncThunk(
  "user/refreshToken",
  async (token: string, thunkAPI) => {
    const response = await authService.refresh(token);
    if (!response.success) {
      const errorResult = response.error!;
      return thunkAPI.rejectWithValue(errorResult);
    }

    return response;
  }
);
