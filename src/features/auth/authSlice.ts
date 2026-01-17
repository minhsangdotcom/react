import { createSlice } from "@reduxjs/toolkit";
import IResponse from "@/types/IResponse";
import Configs from "@/config/keyConfig";
import localStorageHelper from "@utils/storages/localStorageHelper";
import { ILoginResponse } from "@features/auth/ILoginResponse";
import { ITokenResponse } from "@features/auth/ITokenResponse";
import { loginAsync, refreshAsync } from "./authAction";

export interface IAuthInfo {
  token?: string | null;
  refreshToken?: string | null;
}

interface IAuthState extends IAuthInfo {
  isLoading: boolean;
  error: any;
}

const authInfo = localStorageHelper.get<IAuthInfo>(Configs.authInfoKey);
const token = authInfo?.token;
const refreshToken = authInfo?.refreshToken;

const initialState: IAuthState = {
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
          error: action.payload,
        };
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
