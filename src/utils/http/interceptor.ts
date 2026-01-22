import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { showServerErrorToast } from "@/notifications/toastServerError";
import { showBadRequestToast } from "@/notifications/toastBadRequest";
import { showNotFoundToast } from "@/notifications/toastNotFound";
import { showNetworkErrorToast } from "@/notifications/toastNetworkError";
import { Store } from "@reduxjs/toolkit";
import { logout } from "@/features/auth/authSlice";
import { refreshAsync } from "@/features/auth/authAction";

export function requestHandler(
  config: InternalAxiosRequestConfig<any>
): InternalAxiosRequestConfig<any> {
  // add bearer token to header
  tokenHandler(config);

  return config;
}

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

export function toastError(error: AxiosError) {
  if (!error.response) {
    // No response = network error or server down
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      showNetworkErrorToast(
        "Request timeout. Please check your connection.",
        "timeout-error"
      );
    } else if (
      error.code === "ERR_NETWORK" ||
      error.message.includes("Network Error")
    ) {
      showNetworkErrorToast(
        "Unable to connect to server. Please try again later.",
        "network-error"
      );
    } else {
      showNetworkErrorToast(
        "Something went wrong. Please try again.",
        "unknown-error"
      );
    }
    return;
  }

  const errorResult = error.response.data as any;
  switch (error.response.status) {
    case 400:
      if (errorResult?.["invalid-params"]?.length) {
        showBadRequestToast(
          errorResult["invalid-params"][0]?.reasons?.[0]?.description
        );
      }

      if (errorResult?.message?.translation) {
        showBadRequestToast(errorResult.message.translation);
      }
      break;
    case 404:
      showNotFoundToast();
      break;
    case 500:
      showServerErrorToast();
      break;
  }
}
