import { ILoginRequest } from "../../types/auth/ILoginRequest";
import { ILoginResponse } from "../../types/auth/ILoginResponse";
import IResponse from "../../types/IResponse";
import { send } from "../../utils/api/client";

import {
  IBadRequestError,
  INotFoundError,
  IForbiddenError,
  IUnauthorizedError,
} from "../../types/IError";
import { IUser } from "../../types/user/IUser";
import { ITokenResponse } from "../../types/auth/ITokenResponse";
import { IApiResult } from "../../utils/api/IApiResult";

const authService = {
  login: async function (
    form: ILoginRequest
  ): Promise<
    IApiResult<IResponse<ILoginResponse>, IBadRequestError | INotFoundError>
  > {
    return await send({ url: "users/login", method: "POST", data: form });
  },
  getProfile: async function (): Promise<
    IApiResult<
      IResponse<IUser>,
      IBadRequestError | IForbiddenError | IUnauthorizedError
    >
  > {
    return await send({ url: "users/profile", method: "GET" });
  },
  refresh: async function (
    refreshToken: string
  ): Promise<IApiResult<IResponse<ITokenResponse>, IBadRequestError>> {
    return await send({
      url: "users/refreshToken",
      method: "POST",
      data: { refreshToken },
    });
  },
};

export default authService;
