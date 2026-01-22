import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { env } from "@config/env";
import { IApiResult } from "./IApiResult";
import IApiRequest from "./IApiRequest";
import { requestHandler, errorResponseHandler } from "./interceptor";
import * as qs from "qs";
import IResponse from "@/types/IResponse";
import ErrorType from "@/types/IError";

const api = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(requestHandler);
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    await errorResponseHandler(error, api);
  }
);

async function send<TRequest, TResult>(
  request: IApiRequest<TRequest>
): Promise<IApiResult<TResult>> {
  let config = {
    url: request.url,
    method: request.method,
    data: request.data,
    headers: request.headers,
  } as AxiosRequestConfig;

  if (config.method === "GET") {
    delete config.data;
    config.params = request.data;
    config.paramsSerializer = (params) => {
      return qs.stringify(params);
    };
  }

  try {
    const result = await api.request<IResponse<TResult>>(config);
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
