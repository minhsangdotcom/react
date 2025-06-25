import { useEffect, useLayoutEffect, useState } from "react";
import { apiClient } from "../utils/api/client";
import { logout, profileAsync, refreshAsync } from "../store/auth/authSlice";
import { IUser } from "../types/user/IUser";
import { useAppDispatch, useAppSelector } from "../store/hook";

export function useAuth() {
  const dispatch = useAppDispatch();
  const {
    token,
    refreshToken,
    user: initUser,
    isLoading,
  } = useAppSelector((s) => s.auth);
  const [user, setUser] = useState<IUser | null>(initUser ?? null);

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
        if (status === 401) {

          // if get 401 from refresh token api then logout
          if (originalRequest?.url === "users/refreshToken") {
            console.warn("Refresh token request failed, logging out...");
            dispatch(logout());
            return Promise.reject(error);
          }
          
          if (refreshToken) {
            console.warn("token expired, try to do refresh token....");
            var response = await dispatch(refreshAsync(refreshToken)).unwrap();
            
            originalRequest.headers["Authorization"] = `Bearer ${response?.data?.results?.token}`;
            originalRequest._retry = true;
            console.warn("Doing refresh token is completed........");
            
            // calling the failed api with new token after doing refresh token
            return apiClient(originalRequest);
          }
        }
        return Promise.reject(error);
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
      const result = response.payload?.data?.results as IUser;
      if (result) {
        setUser({ ...result });
      }
    });
  }, []);

  return {
    user,
    setUser,
    token,
    refreshToken,
    isLoading,
    apiClient,
  };
}
