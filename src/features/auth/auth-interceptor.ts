import { logout } from "@features/auth/authSlice";
import { refreshAsync } from "@features/auth/authAction";
import { Store } from "@reduxjs/toolkit";
import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

let storeInstance: Store | null = null;

// Function to set the store after it's created
export function injectStore(store: Store) {
  storeInstance = store;
}

// Helper to safely get store
function getStore(): Store {
  if (!storeInstance) {
    throw new Error("Store has not been initialized. Call injectStore first.");
  }
  return storeInstance;
}

export interface AxiosRetryRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

let refreshInProgress: Promise<string> | null = null;

export function tokenHandler(config: InternalAxiosRequestConfig<any>) {
  const store = getStore();
  const token = store.getState().auth.token;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
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
  const store = getStore();
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
      .dispatch(refreshAsync(refreshToken) as any)
      .unwrap()
      .then((res: any) => {
        console.warn("Token's refreshed successfully!.");
        return res.data?.results?.token as string;
      })
      .catch((err: any) => {
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
