import {
  IBadRequestError,
  IForbiddenError,
  IUnauthorizedError,
} from "@/types/IError";
import IQueryParam from "@/types/IQueryParam";
import IResponse from "@/types/IResponse";
import ICreateRoleRequest from "@/features/role/ICreateRoleRequest";
import { IRole, IRoleResponse } from "@/features/role/IRole";
import IUpdateRoleRequest from "@/features/role/IUpdateRoleRequest";
import { send } from "@utils/http/api";
import { IApiResult } from "@utils/http/IApiResult";

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
