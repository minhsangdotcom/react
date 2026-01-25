import { createSlice } from "@reduxjs/toolkit";
import IResponse from "@/types/IResponse";
import { APP_KEY } from "@/config/key";
import { localStorageUtil } from "@/utils/storages/localStorageUtil";
import { ILoginResponse } from "@features/auth/ILoginResponse";
import { ITokenResponse } from "@features/auth/ITokenResponse";
import { loginAsync, refreshAsync } from "./authAction";

interface Auth {
  token?: string | null;
  refreshToken?: string | null;
}

interface AuthState extends Auth {
  isLoading: boolean;
  error: any;
}

function getInitialAuthState(): Auth {
  const auth = localStorageUtil.get<Auth>(APP_KEY.authState);

  return {
    token: auth?.token ?? null,
    refreshToken: auth?.refreshToken ?? null,
  };
}

const initialState: AuthState = {
  ...getInitialAuthState(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state: AuthState) => {
      localStorageUtil.remove(APP_KEY.authState);
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
      .addCase(loginAsync.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state: AuthState, action) => {
        const result = action.payload?.data as IResponse<ILoginResponse>;
        const { token, refreshToken } = result.results as ILoginResponse;

        localStorageUtil.set<Auth>(APP_KEY.authState, {
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
      .addCase(loginAsync.rejected, (state: AuthState, action) => {
        return {
          ...state,
          isLoading: false,
          user: null,
          token: null,
          refreshToken: null,
          error: action?.payload ?? "unknown error",
        };
      })
      .addCase(refreshAsync.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshAsync.fulfilled, (state: AuthState, action) => {
        const result = action.payload.data as IResponse<ITokenResponse>;

        const token = result.results?.token as string;
        const refreshToken = result.results?.refreshToken as string;

        localStorageUtil.set<Auth>(APP_KEY.authState, {
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
      .addCase(refreshAsync.rejected, (state: AuthState, action) => {
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
