import authService from "@/features/auth/authService";
import { ILoginRequest } from "@features/auth/ILoginRequest";
import {
  IBadRequestError,
  INotFoundError,
  IUnauthorizedError,
} from "@/types/IError";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginAsync = createAsyncThunk(
  "user/login",
  async (credentials: ILoginRequest, thunkAPI) => {
    const response = await authService.login(credentials);

    if (response.error?.status === 400) {
      const badRequestResponse = response.error as IBadRequestError;
      return thunkAPI.rejectWithValue(badRequestResponse.message);
    }

    if (response.error?.status == 404) {
      const notFoundResponse = response.error as INotFoundError;
      return thunkAPI.rejectWithValue(notFoundResponse.message);
    }

    return response;
  }
);

export const refreshAsync = createAsyncThunk(
  "user/refreshToken",
  async (token: string, thunkApi) => {
    const response = await authService.refresh(token);
    if (response?.error?.status == 400) {
      const badRequestError = response.error as IBadRequestError;
      return thunkApi.rejectWithValue(badRequestError.message);
    }

    if (response?.error?.status == 401) {
      const unauthorizedRequestError = response.error as IUnauthorizedError;
      return thunkApi.rejectWithValue(unauthorizedRequestError.message);
    }

    return response;
  }
);
