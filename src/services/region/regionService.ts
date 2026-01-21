import {
  IBadRequestError,
  IForbiddenError,
  IUnauthorizedError,
} from "@/types/IError";
import IResponse from "@/types/IResponse";
import { ICommune, IDistrict, IProvince } from "@/types/region/IRegion";
import { send } from "@utils/http/api";
import { IApiResult } from "@utils/http/IApiResult";
import IQueryParam from "@/types/IQueryParam";

export const regionService = {
  listProvince: async function (
    params: IQueryParam
  ): Promise<IApiResult<IProvince[]>> {
    return await send({ url: "provinces", method: "GET", data: params });
  },
  listDistrict: async function (
    params: IQueryParam
  ): Promise<IApiResult<IDistrict[]>> {
    return await send({ url: "districts", method: "GET", data: params });
  },
  listCommune: async function (
    params: IQueryParam
  ): Promise<IApiResult<ICommune[]>> {
    return await send({ url: "communes", method: "GET", data: params });
  },
};
