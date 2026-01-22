import { createAsyncThunk } from "@reduxjs/toolkit";
import profileService from "./profileService";

export const profileAsync = createAsyncThunk(
  "user/profile",
  async (_, thunkAPI) => {
    const response = await profileService.getProfile();
    if (!response.success) {
      const errorResult = response.error!;
      return thunkAPI.rejectWithValue(errorResult);
    }

    return response;
  }
);
