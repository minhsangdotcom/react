import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../services/auth/authService";
import IResponse from "../../types/IResponse";
import {
  IBadRequestError,
  IForbiddenError,
  INotFoundError,
  IUnauthorizedError,
} from "../../types/IError";
import { IUser } from "../../types/user/IUser";
import Configs from "../../config/authConfigs";
import localStorageHelper from "../../utils/storages/localStorageHelper";
import { ILoginResponse } from "@/src/types/Auth/ILoginResponse";
import { ITokenResponse } from "@/src/types/Auth/ITokenResponse";
import { ILoginRequest } from "@/src/types/Auth/ILoginRequest";

interface IAuthState extends IAuthInfo {
  isLoading: boolean;
  error: any;
}
interface IAuthInfo {
  user?: IUser | null;
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

export const loginAsync = createAsyncThunk(
  "user/login",
  async (credentials: ILoginRequest, thunkAPI) => {
    const response = await authService.login(credentials);

    if (response.error?.status === 400) {
      const badRequestResponse = response.error as IBadRequestError;
      return thunkAPI.rejectWithValue(badRequestResponse.errorDetails);
    }

    if (response.error?.status == 404) {
      const notFoundResponse = response.error as INotFoundError;
      return thunkAPI.rejectWithValue(notFoundResponse.errorDetails);
    }

    return response;
  }
);

export const profileAsync = createAsyncThunk(
  "user/profile",
  async (_, thunkApi) => {
    const response = await authService.getProfile();
    if (response?.error?.status == 400) {
      const badRequestError = response.error as IBadRequestError;
      return thunkApi.rejectWithValue(badRequestError.errorDetails);
    }

    if (response?.error?.status == 403) {
      const forbiddenError = response.error as IForbiddenError;
      return thunkApi.rejectWithValue(forbiddenError.errorDetails);
    }

    if (response?.error?.status == 401) {
      const forbiddenError = response.error as IUnauthorizedError;
      return thunkApi.rejectWithValue(forbiddenError.errorDetails);
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
      return thunkApi.rejectWithValue(badRequestError.errorDetails);
    }

    if (response?.error?.status == 401) {
      const unauthorizedRequestError = response.error as IUnauthorizedError;
      return thunkApi.rejectWithValue(unauthorizedRequestError.errorDetails);
    }

    return response;
  }
);

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
        const result = action.payload.data as IResponse<IUser>;
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
