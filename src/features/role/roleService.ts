import IQueryParam from "@/types/IQueryString";
import ICreateRoleRequest from "@/features/role/ICreateRoleRequest";
import { IRole, IRoleResponse } from "@/features/role/IRole";
import IUpdateRoleRequest from "@/features/role/IUpdateRoleRequest";
import { send } from "@/lib/http/api";
import { IApiResult } from "@/lib/http/IApiResult";

export const roleService = {
  list: async function (
    params: IQueryParam,
    signal?: AbortSignal
  ): Promise<IApiResult<IRole[]>> {
    return await send({
      url: "roles",
      method: "GET",
      data: params,
      signal,
    });
  },
  create: async function (
    request: ICreateRoleRequest
  ): Promise<IApiResult<IRoleResponse>> {
    return await send({ url: "roles", method: "POST", data: request });
  },
  delete: async function (id: string): Promise<IApiResult<void>> {
    return await send({ url: `roles/${id}`, method: "DELETE" });
  },
  getById: async function (id: string): Promise<IApiResult<IRoleResponse>> {
    return await send({ url: `roles/${id}`, method: "GET" });
  },
  update: async function (
    id: string,
    request: IUpdateRoleRequest
  ): Promise<IApiResult<IRoleResponse>> {
    return await send({ url: `roles/${id}`, method: "PUT", data: request });
  },
};
