import localStorageHelper from "@/utils/storages/localStorageHelper";
import { createSlice } from "@reduxjs/toolkit";
import keyConfig from "@/config/keyConfig";
import { profileAsync } from "./profileAction";
import { IUserProfileResponse } from "./IUserProfile";
import IResponse from "@/types/IResponse";

interface IProfileInfo {
  user?: IUserProfileResponse | null;
}

interface IProfileState extends IProfileInfo {
  isLoading: boolean;
  error: any;
}

const initialState = {
  user: null,
  isLoading: false,
  error: null,
} as IProfileState;

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(profileAsync.pending, (state: IProfileState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(profileAsync.fulfilled, (state: IProfileState, action) => {
        const result = action.payload.data as
          | IResponse<IUserProfileResponse>
          | undefined;
        const user = result?.results as IUserProfileResponse | undefined;

        localStorageHelper.set<IProfileInfo>(keyConfig.profileInfoKey, {
          user,
        });

        return {
          ...state,
          isLoading: false,
          error: null,
          user,
        };
      })
      .addCase(profileAsync.rejected, (state: IProfileState, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.error,
        };
      });
  },
});

export default profileSlice.reducer;
