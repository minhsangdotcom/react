import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../services/auth/authService";
import IResponse from "../../types/IResponse";
import { ILoginRequest } from "../../types/auth/ILoginRequest";
import { ILoginResponse } from "../../types/auth/ILoginResponse";
import {
  IBadRequestError,
  IForbiddenError,
  INotFoundError,
  IUnauthorizedError,
} from "../../types/IError";
import { IUser } from "../../types/user/IUser";
import { ITokenResponse } from "../../types/auth/ITokenResponse";

interface AuthState {
  user: IUser | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: any;
}
const userInfo = localStorage.getItem("userInfo");
const user = userInfo ? JSON.parse(userInfo) : null;
const token = user?.token;
const refreshToken = user?.refreshToken;
const initialState: AuthState = {
  user: user?.user,
  token,
  loading: false,
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

    return response;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state: AuthState) => {
      localStorage.removeItem("userInfo");
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        loading: false,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state: AuthState, action) => {
        const result = action.payload?.data as IResponse<ILoginResponse>;
        const { token, refreshToken } = result.results!;
        localStorage.setItem(
          "userInfo",
          JSON.stringify({ token, refreshToken })
        );
        
        return {
          ...state,
          loading: false,
          token: token,
          refreshToken: refreshToken,
          error: null,
        };
      })
      .addCase(loginAsync.rejected, (state: AuthState, action) => {
        return {
          ...state,
          loading: false,
          user: null,
          token: null,
          refreshToken: null,
          error: action?.payload ?? "unknown error",
        };
      })
      .addCase(profileAsync.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(profileAsync.fulfilled, (state: AuthState, action) => {
        const result = action.payload.data as IResponse<IUser>;
        const user = result?.results;

        const uerInfo = JSON.parse(localStorage.getItem("userInfo")!);
        localStorage.setItem("userInfo", JSON.stringify({ ...uerInfo, user }));
        return {
          ...state,
          loading: false,
          error: null,
          user,
        };
      })
      .addCase(profileAsync.rejected, (state: AuthState, action) => {
        return {
          ...state,
          loading: false,
          user: null,
          error: action?.payload ?? "unknown error",
        };
      })
      .addCase(refreshAsync.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshAsync.fulfilled, (state: AuthState, action) => {
        const result = action.payload.data as IResponse<ITokenResponse>;

        const token = result?.results?.token!;
        const refreshToken = result?.results?.refreshToken!;

        const uerInfo = JSON.parse(localStorage.getItem("userInfo")!);
        localStorage.setItem(
          "userInfo",
          JSON.stringify({ ...uerInfo, token, refreshToken })
        );
        return {
          ...state,
          loading: false,
          error: null,
          refreshToken,
          token,
        };
      })
      .addCase(refreshAsync.rejected, (state: AuthState, action) => {
        return {
          ...state,
          loading: false,
          error: action?.payload ?? "unknown error",
        };
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
