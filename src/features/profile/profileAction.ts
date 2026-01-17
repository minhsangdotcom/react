import { createAsyncThunk } from "@reduxjs/toolkit";
import profileService from "./profileService";
import { IBadRequestError, IForbiddenError, IUnauthorizedError } from "@/types/IError";

export const profileAsync = createAsyncThunk(
  "user/profile",
  async (_, thunkApi) => {
    const response = await profileService.getProfile();
    if (response?.error?.status == 400) {
      const badRequestError = response.error as IBadRequestError;
      return thunkApi.rejectWithValue(badRequestError.message);
    }

    if (response?.error?.status == 403) {
      const forbiddenError = response.error as IForbiddenError;
      return thunkApi.rejectWithValue(forbiddenError.message);
    }

    if (response?.error?.status == 401) {
      const forbiddenError = response.error as IUnauthorizedError;
      return thunkApi.rejectWithValue(forbiddenError.message);
    }

    return response;
  }
);