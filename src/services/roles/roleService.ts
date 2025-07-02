import {
  IBadRequestError,
  IForbiddenError,
  IUnauthorizedError,
} from "@/src/types/IError";
import IQueryParam from "@/src/types/IQueryParam";
import IResponse from "@/src/types/IResponse";
import { IRole } from "@/src/types/role/IRole";
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
};
