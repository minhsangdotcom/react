import {
  IBadRequestError,
  IForbiddenError,
  IUnauthorizedError,
} from "@/src/types/IError";
import IQueryParam from "@/src/types/IQueryParam";
import IResponse from "@/src/types/IResponse";
import ICreateRoleRequest from "@/src/types/role/ICreateRoleRequest";
import { IRole, IRoleResponse } from "@/src/types/role/IRole";
import IUpdateRoleRequest from "@/src/types/role/IUpdateRoleRequest";
import { send } from "@/src/utils/api/client";
import { IApiResult } from "@/src/utils/api/IApiResult";

export const roleService = {
  list: async function (
    params: IQueryParam
  ): Promise<
    IApiResult<
      IResponse<Array<IRole>>,
      IBadRequestError | IUnauthorizedError | IForbiddenError
    >
  > {
    return await send({ url: "roles", method: "GET", data: params });
  },
  create: async function (
    request: ICreateRoleRequest
  ): Promise<
    IApiResult<
      IResponse<IRoleResponse>,
      IBadRequestError | IUnauthorizedError | IForbiddenError
    >
  > {
    return await send({ url: "roles", method: "POST", data: request });
  },
  delete: async function (
    id: string
  ): Promise<
    IApiResult<void, IBadRequestError | IUnauthorizedError | IForbiddenError>
  > {
    return await send({ url: `roles/${id}`, method: "DELETE" });
  },
  getById: async function (
    id: string
  ): Promise<
    IApiResult<
      IResponse<IRoleResponse>,
      IBadRequestError | IUnauthorizedError | IForbiddenError
    >
  > {
    return await send({ url: `roles/${id}`, method: "GET" });
  },
  update: async function (
    id: string,
    request: IUpdateRoleRequest
  ): Promise<
    IApiResult<
      IResponse<IRoleResponse>,
      IBadRequestError | IUnauthorizedError | IForbiddenError
    >
  > {
    return await send({ url: `roles/${id}`, method: "PUT", data: request });
  },
};
