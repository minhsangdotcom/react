import { store } from "@/store/store";
import { logout } from "@features/auth/authSlice";
import { refreshAsync } from "@features/auth/authAction";
import { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

export interface AxiosRetryRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

let refreshInProgress: Promise<string> | null = null;

export function tokenHandler(
  config: InternalAxiosRequestConfig<any>
): InternalAxiosRequestConfig<any> {
  const token = store.getState().auth.token;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

export async function refreshTokenHandler(
  error: AxiosError,
  api: AxiosInstance
): Promise<any> {
  const status = error.response?.status;
  const originalRequest = error.config as AxiosRetryRequestConfig;

  if (status !== 401 || !originalRequest) {
    return Promise.reject(error);
  }

  // ❗ If refresh-token API itself fails → logout
  if (originalRequest.url?.includes("users/refresh-token")) {
    console.warn("Refresh token failed → logout");
    store.dispatch(logout());
    return Promise.reject(error);
  }

  const refreshToken = store.getState().auth.refreshToken;

  if (!refreshToken || originalRequest._retry) {
    return Promise.reject(error);
  }

  originalRequest._retry = true;

  if (!refreshInProgress) {
    console.warn("Access token expired → refreshing...");

    refreshInProgress = store
      .dispatch(refreshAsync(refreshToken))
      .unwrap()
      .then((res) => res.data?.results?.token!)
      .catch((err) => {
        store.dispatch(logout());
        throw err;
      })
      .finally(() => {
        refreshInProgress = null;
      });
  }

  try {
    const newToken = await refreshInProgress;

    originalRequest.headers = {
      ...originalRequest.headers,
      Authorization: `Bearer ${newToken}`,
    };

    // 🔁 Retry failed request with new token
    return api(originalRequest);
  } catch (err) {
    return Promise.reject(err);
  }
}
