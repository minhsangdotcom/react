import { Commune, District, Province } from "@/features/region/IRegion";
import { send } from "@/lib/http/api";
import { ApiResult } from "@/lib/http/IApiResult";
import { QueryString } from "@/types/IQueryString";

export const regionService = {
  listProvince: async function (
    params: QueryString
  ): Promise<ApiResult<Province[]>> {
    return await send({ url: "provinces", method: "GET", data: params });
  },
  listDistrict: async function (
    params: QueryString
  ): Promise<ApiResult<District[]>> {
    return await send({ url: "districts", method: "GET", data: params });
  },
  listCommune: async function (
    params: QueryString
  ): Promise<ApiResult<Commune[]>> {
    return await send({ url: "communes", method: "GET", data: params });
  },
};
