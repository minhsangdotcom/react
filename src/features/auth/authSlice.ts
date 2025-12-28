import { createSlice } from "@reduxjs/toolkit";
import IResponse from "@/types/IResponse";
import Configs from "@config/authConfigs";
import localStorageHelper from "@utils/storages/localStorageHelper";
import { ILoginResponse } from "@features/auth/ILoginResponse";
import { ITokenResponse } from "@features/auth/ITokenResponse";
import { IUserProfileResponse } from "@/types/user/IUserProfile";
import { loginAsync, profileAsync, refreshAsync } from "./authAction";

interface IAuthState extends IAuthInfo {
  isLoading: boolean;
  error: any;
}
interface IAuthInfo {
  user?: IUserProfileResponse | null;
  token?: string | null;
  refreshToken?: string | null;
}

const authInfo = localStorageHelper.get<IAuthInfo>(Configs.authInfoKey);
const token = authInfo?.token;
const refreshToken = authInfo?.refreshToken;

const initialState: IAuthState = {
  user: null,
  token,
  isLoading: false,
  error: null,
  refreshToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state: IAuthState) => {
      localStorageHelper.remove(Configs.authInfoKey);
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isLoading: false,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state: IAuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state: IAuthState, action) => {
        const result = action.payload?.data as IResponse<ILoginResponse>;
        const { token, refreshToken } = result.results!;

        localStorageHelper.set<IAuthInfo>(Configs.authInfoKey, {
          token,
          refreshToken,
        });

        return {
          ...state,
          isLoading: false,
          token: token,
          refreshToken: refreshToken,
          error: null,
        };
      })
      .addCase(loginAsync.rejected, (state: IAuthState, action) => {
        return {
          ...state,
          isLoading: false,
          user: null,
          token: null,
          refreshToken: null,
          error: action?.payload ?? "unknown error",
        };
      })
      .addCase(profileAsync.pending, (state: IAuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(profileAsync.fulfilled, (state: IAuthState, action) => {
        const result = action.payload.data as IResponse<IUserProfileResponse>;
        const user = result?.results;

        const authInfo = localStorageHelper.get<IAuthInfo>(Configs.authInfoKey);
        localStorageHelper.set<IAuthInfo>(Configs.authInfoKey, {
          ...authInfo,
          user,
        });

        return {
          ...state,
          isLoading: false,
          error: null,
          user,
        };
      })
      .addCase(profileAsync.rejected, (state: IAuthState, action) => {
        return {
          ...state,
          isLoading: false,
          user: null,
          error: action?.payload ?? "unknown error",
        };
      })
      .addCase(refreshAsync.pending, (state: IAuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshAsync.fulfilled, (state: IAuthState, action) => {
        const result = action.payload.data as IResponse<ITokenResponse>;

        const token = result?.results?.token!;
        const refreshToken = result?.results?.refreshToken!;

        localStorageHelper.set<IAuthInfo>(Configs.authInfoKey, {
          token,
          refreshToken,
        });
        return {
          ...state,
          isLoading: false,
          error: null,
          refreshToken,
          token,
        };
      })
      .addCase(refreshAsync.rejected, (state: IAuthState, action) => {
        return {
          ...state,
          isLoading: false,
          error: action.payload ?? "unknown error",
        };
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
