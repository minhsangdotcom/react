import {
  IBadRequestError,
  IForbiddenError,
  IUnauthorizedError,
} from "@/src/types/IError";
import IQueryParam from "@/src/types/IQueryParam";
import IResponse, { IPagination } from "@/src/types/IResponse";
import { IUser } from "@/src/types/user/IUser";
import { send } from "@/src/utils/http/api";
import { IApiResult } from "@/src/utils/http/IApiResult";

export const userService = {
  list: async function (
    params: IQueryParam
  ): Promise<
    IApiResult<
      IResponse<IPagination<Array<IUser>>>,
      IBadRequestError | IUnauthorizedError | IForbiddenError
    >
  > {
    return await send({ url: "users", method: "GET", data: params });
  },
};
