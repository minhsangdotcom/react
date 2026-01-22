import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import {
  refreshTokenHandler,
  tokenHandler,
} from "@features/auth/auth-interceptor";
import toast from "react-hot-toast";

export function requestHandler(
  config: InternalAxiosRequestConfig<any>
): InternalAxiosRequestConfig<any> {
  // put bearer token to header
  tokenHandler(config);

  return config;
}
const notify = () => toast("500 error");
export async function errorResponseHandler(
  error: AxiosError,
  api: AxiosInstance
): Promise<any> {
  if (error.response?.status == 500) {
    notify();
    return Promise.reject(error);
  }

  // handle refreshing token
  await refreshTokenHandler(error, api);
}
