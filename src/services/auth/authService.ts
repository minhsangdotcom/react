import IResponse from "../../types/IResponse";
import { send } from "../../utils/http/api";

import {
  IBadRequestError,
  INotFoundError,
  IForbiddenError,
  IUnauthorizedError,
} from "../../types/IError";
import { IApiResult } from "../../utils/http/IApiResult";
import IResetpasswordRequest from "@/src/types/auth/IResetPasswordRequest";
import { ILoginResponse } from "@/src/types/auth/ILoginResponse";
import { ITokenResponse } from "@/src/types/auth/ITokenResponse";
import { ILoginRequest } from "@/src/types/auth/ILoginRequest";
import { IUserProfileResponse } from "@/src/types/user/IUserProfile";

const authService = {
  login: async function (
    request: ILoginRequest
  ): Promise<
    IApiResult<IResponse<ILoginResponse>, IBadRequestError | INotFoundError>
  > {
    return await send({ url: "users/login", method: "POST", data: request });
  },
  getProfile: async function (): Promise<
    IApiResult<
      IResponse<IUserProfileResponse>,
      IBadRequestError | IForbiddenError | IUnauthorizedError
    >
  > {
    return await send({ url: "users/profile", method: "GET" });
  },
  updateProfile: async function (
    request: FormData
  ): Promise<
    IApiResult<
      IResponse<IUserProfileResponse>,
      IBadRequestError | IForbiddenError | IUnauthorizedError
    >
  > {
    return await send({
      url: "users/profile",
      method: "PUT",
      data: request,
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  refresh: async function (
    refreshToken: string
  ): Promise<
    IApiResult<IResponse<ITokenResponse>, IBadRequestError | IUnauthorizedError>
  > {
    return await send({
      url: "users/refresh-token",
      method: "POST",
      data: { refreshToken },
    });
  },
  requestResetPassword: async function (
    email: string
  ): Promise<IApiResult<void, IBadRequestError | INotFoundError>> {
    return await send({
      url: "users/request-reset-password",
      method: "POST",
      data: { email },
    });
  },
  resetPassword: async function (
    userId: string,
    request: IResetpasswordRequest
  ): Promise<IApiResult<void, IBadRequestError | INotFoundError>> {
    return await send({
      url: `users/${userId}/reset-password`,
      method: "PUT",
      data: { ...request },
    });
  },
};

export default authService;
