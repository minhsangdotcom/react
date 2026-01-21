import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { env } from "@config/env";
import { IApiResult } from "./IApiResult";
import IApiRequest from "./IApiRequest";
import { requestHandler, errorResponseHandler } from "./interceptor";
import * as qs from "qs";

const api = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(requestHandler);
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    await errorResponseHandler(error, api);
  }
);

async function send<TRequest, TResult, TError>(
  request: IApiRequest<TRequest>
): Promise<IApiResult<TResult, TError>> {
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
    const response = await api.request<TResult>(config);
    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (err) {
    const axiosError = err as AxiosError<TError>;

    return {
      success: false,
      status: axiosError.response?.status ?? 0,
      error: axiosError.response?.data,
    };
  }
}

export { api, send };
