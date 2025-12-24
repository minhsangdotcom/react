import axios from "axios";
import { env } from "../../config/env";
import { IApiResult } from "./IApiResult";
import IAxiosRequest from "./IAxiosRequest";
import { store } from "@/src/store/store";
import { logout } from "@/src/features/auth/authSlice";
import { refreshAsync } from "@/src/features/auth/authAction";

const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshInProgress: Promise<string> | null = null;

apiClient.interceptors.request.use((cfg: any) => {
  const { token } = store.getState().auth;
  if (!cfg._retry && token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { refreshToken } = store.getState().auth;
    const originalRequest = error.config;
    const status = error.response?.status;
    if (status !== 401) {
      return Promise.reject(error);
    }

    // if get 401 from refresh token api then logout
    if (originalRequest?.url === "users/refresh-token") {
      console.warn("Refresh token request failed, logging out...");
      store.dispatch(logout());
      return Promise.reject(error);
    }

    if (refreshToken && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshInProgress) {
        console.warn("token expired, try to do refresh token....");
        refreshInProgress = store
          .dispatch(refreshAsync(refreshToken))
          .unwrap()
          .then((res) => res.data?.results?.token!)
          .catch((err) => {
            store.dispatch(logout());
            throw err;
          })
          .finally(() => {
            console.warn("Doing refresh token is completed........");
            refreshInProgress = null;
          });
      }

      try {
        const newToken = await refreshInProgress;
        originalRequest.headers!["Authorization"] = `Bearer ${newToken}`;

        // calling the failed api with new token after doing refresh token
        return apiClient(originalRequest);
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
);

async function send<TRequest, TResult, TError>(
  request: IAxiosRequest<TRequest>
): Promise<IApiResult<TResult, TError>> {
  try {
    let params = {
      url: request.url,
      method: request.method,
      data: request.data,
      headers: request.headers,
    } as any;

    if (params.method === "GET") {
      delete params.data;
      params.params = request.data;
    }

    const result = (await apiClient(params)).data as TResult;
    return { isSuccess: true, data: result, error: null };
  } catch (error: any) {
    const err = error?.response?.data as TError;
    return { isSuccess: false, data: null, error: err };
  }
}

export { apiClient, send };
