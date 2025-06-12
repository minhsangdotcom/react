import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import IUser from "../../types/Auth/User";
import authService from "../../features/auth/authService";
import IResponse from "../../types/IResponse";
import { ILoginRequest } from "../../types/Auth/ILoginRequest";
import { ILoginResponse } from "../../types/Auth/ILoginResponse";
import {
  IBadRequestResponse,
  IErrorResponse,
  INotFoundResponse,
} from "../../types/IErrorResponse";

interface AuthState {
  user: null | IUser;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: any;
}
const userInfo = localStorage.getItem("userInfo");
const initialState: AuthState = {
  user: null,
  token: userInfo ? JSON.parse(userInfo)?.token : null,
  loading: false,
  error: null,
  refreshToken: null,
};

export const loginAsync = createAsyncThunk<
  | IResponse<ILoginResponse>
  | IErrorResponse<IBadRequestResponse>
  | IErrorResponse<INotFoundResponse>
  | null,
  ILoginRequest,
  { rejectValue: any }
>("user/login", async (credentials, thunkAPI) => {
  const response = await authService.login(credentials);

  if (response?.status == 400) {
    const badRequestResponse = response as IErrorResponse<IBadRequestResponse>;
    return thunkAPI.rejectWithValue(badRequestResponse.ErrorDetail);
  }

  if (response?.status == 404) {
    const notFoundResponse = response as IErrorResponse<INotFoundResponse>;
    return thunkAPI.rejectWithValue(notFoundResponse.ErrorDetail);
  }

  return response;
});

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
      .addCase(
        loginAsync.fulfilled,
        (
          state: AuthState,
          action: PayloadAction<
            | IResponse<ILoginResponse>
            | IErrorResponse<IBadRequestResponse>
            | IErrorResponse<INotFoundResponse>
            | null
          >
        ) => {
          const data = action.payload;
          const result = data as IResponse<ILoginResponse>;
          const { token } = result.results!;
          localStorage.setItem("userInfo", JSON.stringify({ token }));
          return {
            ...state,
            loading: false,
            token: token,
            error: null,
          };
        }
      )
      .addCase(loginAsync.rejected, (state: AuthState, action) => {
        return {
          ...state,
          loading: false,
          user: null,
          token: null,
          error: action?.payload ?? "unknown error",
        };
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
