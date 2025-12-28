import {
  IBadRequestError,
  IForbiddenError,
  IUnauthorizedError,
} from "@/types/IError";
import IQueryParam from "@/types/IQueryParam";
import IResponse, { IPagination } from "@/types/IResponse";
import { IUser } from "@/features/user/IUser";
import { send } from "@utils/http/api";
import { IApiResult } from "@utils/http/IApiResult";

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
