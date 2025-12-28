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
  error: null;
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
        const result = action.payload.data as IResponse<IUserProfileResponse>;
        const user = result.results as IUserProfileResponse | undefined;

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
        state.isLoading = false;

        if (action.payload) {
          state.error = action.payload as any;
        } else {
          state.error = {
            message: action.error.message ?? "Something went wrong",
          } as any;
        }
        return state;
      });
  },
});

export default profileSlice.reducer;
