import { ICommune, IDistrict, IProvince } from "@/features/region/IRegion";
import { send } from "@/lib/http/api";
import { IApiResult } from "@/lib/http/IApiResult";
import IQueryParam from "@/types/IQueryString";

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
