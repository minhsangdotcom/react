import { localStorageUtil } from "@/utils/storages/localStorageUtil";
import { createSlice } from "@reduxjs/toolkit";
import { APP_KEY } from "@/config/key";
import { profileAsync } from "./profileAction";
import { UserProfileResponse } from "./IUserProfile";
import { Response } from "@/types/IResponse";

interface ProfileInfo {
  user?: UserProfileResponse | null;
}

interface ProfileState extends ProfileInfo {
  isLoading: boolean;
  error: any;
}

const initialState = {
  user: null,
  isLoading: false,
  error: null,
} as ProfileState;

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(profileAsync.pending, (state: ProfileState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(profileAsync.fulfilled, (state: ProfileState, action) => {
        const result = action.payload.data as
          | Response<UserProfileResponse>
          | undefined;
        const user = result?.results as UserProfileResponse | undefined;

        localStorageUtil.set<ProfileInfo>(APP_KEY.profileState, {
          user,
        });

        return {
          ...state,
          isLoading: false,
          error: null,
          user,
        };
      })
      .addCase(profileAsync.rejected, (state: ProfileState, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.error,
        };
      });
  },
});

export default profileSlice.reducer;
