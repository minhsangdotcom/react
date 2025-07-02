import {
  IBadRequestError,
  IForbiddenError,
  IUnauthorizedError,
} from "../../types/IError";
import IResponse from "../../types/IResponse";
import { ICommune, IDistrict, IProvince } from "../../types/regions/IRegion";
import { send } from "../../utils/api/client";
import { IApiResult } from "../../utils/api/IApiResult";
import IQueryParam from "../../types/IQueryParam";

export const regionService = {
  listProvince: async function (
    params: IQueryParam
  ): Promise<
    IApiResult<
      IResponse<{ data: Array<IProvince> }>,
      IBadRequestError | IUnauthorizedError | IForbiddenError
    >
  > {
    return await send({ url: "provinces", method: "GET", data: params });
  },
  listDistrict: async function (
    params: IQueryParam
  ): Promise<
    IApiResult<
      IResponse<{ data: Array<IDistrict> }>,
      IBadRequestError | IUnauthorizedError | IForbiddenError
    >
  > {
    return await send({ url: "districts", method: "GET", data: params });
  },
  listCommune: async function (
    params: IQueryParam
  ): Promise<
    IApiResult<
      IResponse<{ data: Array<ICommune> }>,
      IBadRequestError | IUnauthorizedError | IForbiddenError
    >
  > {
    return await send({ url: "communes", method: "GET", data: params });
  },
};
