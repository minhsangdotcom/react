import { useEffect, useLayoutEffect, useState } from "react";
import { apiClient } from "../utils/api/client";
import { logout, profileAsync, refreshAsync } from "../store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { IUserProfileResponse } from "../types/user/IUserProfile";

let refreshInProgress: Promise<string> | null = null;

export function useAuth() {
  const dispatch = useAppDispatch();
  const {
    token,
    refreshToken,
    user: initUser,
    isLoading,
  } = useAppSelector((s) => s.auth);
  const [user, setUser] = useState<IUserProfileResponse | null>(
    initUser ?? null
  );

  useLayoutEffect(() => {
    const id1 = apiClient.interceptors.request.use((cfg: any) => {
      if (!cfg._retry && token) {
        cfg.headers.Authorization = `Bearer ${token}`;
      }
      return cfg;
    });
    return () => {
      apiClient.interceptors.request.eject(id1);
    };
  }, [dispatch, token]);

  useLayoutEffect(() => {
    const id2 = apiClient.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        if (status !== 401) {
          return Promise.reject(error);
        }

        // if get 401 from refresh token api then logout
        if (originalRequest?.url === "users/refreshToken") {
          console.warn("Refresh token request failed, logging out...");
          dispatch(logout());
          return Promise.reject(error);
        }

        if (refreshToken && !originalRequest._retry) {
          originalRequest._retry = true;

          if (!refreshInProgress) {
            console.warn("token expired, try to do refresh token....");
            refreshInProgress = dispatch(refreshAsync(refreshToken))
              .unwrap()
              .then((res) => res.data?.results?.token!)
              .catch((err) => {
                dispatch(logout());
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

    return () => {
      apiClient.interceptors.response.eject(id2);
    };
  });

  useEffect(() => {
    if (!token) {
      return;
    }
    dispatch(profileAsync()).then((response: any) => {
      const result = response.payload?.data?.results as IUserProfileResponse;
      if (result) {
        setUser({ ...result });
      }
    });
  }, []);

  return {
    currentUser: user,
    setUser,
    token,
    refreshToken,
    isLoading,
    apiClient,
  };
}
