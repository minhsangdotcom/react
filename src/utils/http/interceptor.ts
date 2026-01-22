import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import {
  refreshTokenHandler,
  tokenHandler,
} from "@features/auth/auth-interceptor";
import { showServerErrorToast } from "@/notifications/toastServerError";

export function requestHandler(
  config: InternalAxiosRequestConfig<any>
): InternalAxiosRequestConfig<any> {
  // add bearer token to header
  tokenHandler(config);

  return config;
}
export async function errorResponseHandler(
  error: AxiosError,
  api: AxiosInstance
): Promise<any> {
  if (error.response?.status == 500) {
    showServerErrorToast();
    return Promise.reject(error);
  }

  // handle refreshing token
  await refreshTokenHandler(error, api);
}
