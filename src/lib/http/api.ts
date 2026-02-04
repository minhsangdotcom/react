import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { env } from "@config/env";
import { ApiResult } from "./IApiResult";
import { ApiRequest } from "./IApiRequest";
import * as qs from "qs";
import { Response } from "@/types/IResponse";
import ErrorType from "@/types/IError";
import {
  languageHandler,
  refreshTokenHandler,
  toastError,
  tokenHandler,
} from "./interceptor";

const api = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: any) => {
  tokenHandler(config);
  languageHandler(config);
  return config;
});
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => await refreshTokenHandler(error, api)
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    toastError(error, axios.isCancel(error));
    return Promise.reject(error);
  }
);

async function send<TRequest, TResult>(
  request: ApiRequest<TRequest>
): Promise<ApiResult<TResult>> {
  let config = {
    url: request.url,
    method: request.method,
    data: request.data,
    headers: request.headers,
    signal: request.signal,
  } as AxiosRequestConfig;

  if (config.method === "GET") {
    delete config.data;
    config.params = request.data;
    config.paramsSerializer = (params) => {
      return qs.stringify(params);
    };
  }

  try {
    const result = await api.request<Response<TResult>>(config);
    return {
      success: true,
      status: result.status,
      data: result.data,
    };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    const errorResult = axiosError.response?.data;
    return {
      success: false,
      status: errorResult?.status,
      error: errorResult,
    };
  }
}

export { api, send };
