import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { env } from "../../config/env";
import { IApiResult } from "./IApiResult";
import IApiRequest from "./IApiRequest";
import { requestHandler, errorResponseHandler } from "./interceptor";

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
  }

  try {
    const response = await api.request<TResult>(config);
    return {
      isSuccess: true,
      data: response.data,
      error: null,
    };
  } catch (err) {
    const axiosError = err as AxiosError<TError>;

    return {
      isSuccess: false,
      data: null,
      error: axiosError.response?.data ?? null,
    };
  }
}

export { api, send };
