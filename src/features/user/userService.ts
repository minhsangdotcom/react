import IQueryParam from "@/types/IQueryParam";
import { IPagination } from "@/types/IResponse";
import { IUserResponse } from "@/features/user/IUser";
import { send } from "@/lib/http/api";
import { IApiResult } from "@/lib/http/IApiResult";

export const userService = {
  list: async function (
    params: IQueryParam
  ): Promise<IApiResult<IPagination<IUserResponse[]>>> {
    return await send({ url: "users", method: "GET", data: params });
  },
  update: async function (
    id: string,
    request: FormData
  ): Promise<IApiResult<IUserResponse>> {
    return await send({
      url: `users/${id}`,
      method: "PUT",
      data: request,
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  get: async function (id: string): Promise<IApiResult<IUserResponse>> {
    return await send({
      url: `users/${id}`,
      method: "GET",
    });
  },
  create: async function (
    request: FormData
  ): Promise<IApiResult<IUserResponse>> {
    return await send({
      url: "users",
      method: "POST",
      data: request,
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: async function (id: string): Promise<IApiResult<void>> {
    return await send({
      url: `users/${id}`,
      method: "DELETE",
    });
  },
};
