import axios from "axios";
import { env } from "../../config/env";
import { IApiResult } from "./IApiResult";
import IAxiosRequest from "./IAxiosRequest";

const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

async function send<TRequest, TResult, TError>(
  request: IAxiosRequest<TRequest>
): Promise<IApiResult<TResult, TError>> {
  try {
    const result = (await apiClient({
      url: request.url,
      method: request.method,
      data: request.data,
    })).data as TResult;
    return { isSuccess: true, data: result, error: null };
  } catch (error: any) {
    const err = error.response.data as TError;
    return { isSuccess: true, data: null, error: err };
  }
}

export { apiClient, send };
