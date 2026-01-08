import {
  IBadRequestError,
  IForbiddenError,
  IUnauthorizedError,
} from "@/types/IError";
import IQueryParam from "@/types/IQueryParam";
import IResponse, { IPagination } from "@/types/IResponse";
import { IUserResponse } from "@/features/user/IUser";
import { send } from "@utils/http/api";
import { IApiResult } from "@utils/http/IApiResult";

export const userService = {
  list: async function (
    params: IQueryParam
  ): Promise<
    IApiResult<
      IResponse<IPagination<Array<IUserResponse>>>,
      IBadRequestError | IUnauthorizedError | IForbiddenError
    >
  > {
    return await send({ url: "users", method: "GET", data: params });
  },
  update: async function (
    id: string,
    request: FormData
  ): Promise<
    IApiResult<
      IResponse<IUserResponse>,
      IBadRequestError | IUnauthorizedError | IForbiddenError
    >
  > {
    return await send({
      url: `users/${id}`,
      method: "PUT",
      data: request,
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  get: async function (
    id: string
  ): Promise<
    IApiResult<
      IResponse<IUserResponse>,
      IBadRequestError | IUnauthorizedError | IForbiddenError
    >
  > {
    return await send({
      url: `users/${id}`,
      method: "GET",
    });
  },
  create: async function (
    request: FormData
  ): Promise<
    IApiResult<
      IResponse<IUserResponse>,
      IBadRequestError | IUnauthorizedError | IForbiddenError
    >
  > {
    return await send({
      url: "users",
      method: "POST",
      data: request,
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: async function (
    id: string
  ): Promise<
    IApiResult<void, IBadRequestError | IUnauthorizedError | IForbiddenError>
  > {
    return await send({
      url: `users/${id}`,
      method: "DELETE",
    });
  },
};
