import { QueryString } from "@/types/IQueryString";
import { Pagination } from "@/types/IResponse";
import { send } from "@/lib/http/api";
import { ApiResult } from "@/lib/http/IApiResult";
import { UserResponse } from "./IUser";

export const userService = {
  list: async function (
    params: QueryString
  ): Promise<ApiResult<Pagination<UserResponse[]>>> {
    return await send({ url: "users", method: "GET", data: params });
  },
  update: async function (
    id: string,
    request: FormData
  ): Promise<ApiResult<UserResponse>> {
    return await send({
      url: `users/${id}`,
      method: "PUT",
      data: request,
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  get: async function (id: string): Promise<ApiResult<UserResponse>> {
    return await send({
      url: `users/${id}`,
      method: "GET",
    });
  },
  create: async function (
    request: FormData
  ): Promise<ApiResult<UserResponse>> {
    return await send({
      url: "users",
      method: "POST",
      data: request,
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: async function (id: string): Promise<ApiResult<void>> {
    return await send({
      url: `users/${id}`,
      method: "DELETE",
    });
  },
};
