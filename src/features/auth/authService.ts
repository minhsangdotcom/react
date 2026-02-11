import { send } from "@/lib/http/api";
import { ApiResult } from "@/lib/http/IApiResult";
import { ResetpasswordRequest } from "@/features/auth/IResetPasswordRequest";
import { LoginResponse } from "@features/auth/ILoginResponse";
import { TokenResponse } from "@features/auth/ITokenResponse";
import { LoginRequest } from "@features/auth/ILoginRequest";
import { ChangePasswordRequest } from "./IChangePasswordRequest";

const authService = {
  login: async function (
    request: LoginRequest
  ): Promise<ApiResult<LoginResponse>> {
    return await send({ url: "users/login", method: "POST", data: request });
  },
  refresh: async function (
    refreshToken: string
  ): Promise<ApiResult<TokenResponse>> {
    return await send({
      url: "users/refresh-token",
      method: "POST",
      data: { refreshToken },
    });
  },
  requestResetPassword: async function (
    email: string
  ): Promise<ApiResult<void>> {
    return await send({
      url: "users/request-reset-password",
      method: "POST",
      data: { email },
    });
  },
  resetPassword: async function (
    request: ResetpasswordRequest
  ): Promise<ApiResult<void>> {
    return await send({
      url: "users/reset-password",
      method: "POST",
      data: { ...request },
    });
  },
  changePassword: async function (
    request: ChangePasswordRequest
  ): Promise<ApiResult<void>> {
    return await send({
      url: "users/change-password",
      method: "PUT",
      data: { ...request },
    });
  },
};

export default authService;
