import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import {
  refreshTokenHandler,
  tokenHandler,
} from "@features/auth/auth-interceptor";
export function requestHandler(
  config: InternalAxiosRequestConfig<any>
): InternalAxiosRequestConfig<any> {
  // put bearer token to header
  tokenHandler(config);

  return config;
}
export async function errorResponseHandler(
  error: any,
  api: AxiosInstance
): Promise<any> {
  // handle refreshing token
  await refreshTokenHandler(error, api);
}
