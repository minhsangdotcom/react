import { send } from "@utils/http/api";
import { IApiResult } from "@utils/http/IApiResult";
import IResetpasswordRequest from "@/features/auth/IResetPasswordRequest";
import { ILoginResponse } from "@features/auth/ILoginResponse";
import { ITokenResponse } from "@features/auth/ITokenResponse";
import { ILoginRequest } from "@features/auth/ILoginRequest";

const authService = {
  login: async function (
    request: ILoginRequest
  ): Promise<IApiResult<ILoginResponse>> {
    return await send({ url: "users/login", method: "POST", data: request });
  },
  refresh: async function (
    refreshToken: string
  ): Promise<IApiResult<ITokenResponse>> {
    return await send({
      url: "users/refresh-token",
      method: "POST",
      data: { refreshToken },
    });
  },
  requestResetPassword: async function (
    email: string
  ): Promise<IApiResult<void>> {
    return await send({
      url: "users/request-reset-password",
      method: "POST",
      data: { email },
    });
  },
  resetPassword: async function (
    request: IResetpasswordRequest
  ): Promise<IApiResult<void>> {
    return await send({
      url: "users/reset-password",
      method: "PUT",
      data: { ...request },
    });
  },
};

export default authService;
