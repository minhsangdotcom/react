import { useEffect, useLayoutEffect, useState } from "react";
import { apiClient } from "../utils/api/client";
import { profileAsync, refreshAsync } from "../store/auth/authSlice";
import { IUser } from "../types/user/IUser";
import { useAppDispatch, useAppSelector } from "../store/hook";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { token, refreshToken, user: initUser, isLoading } = useAppSelector((s) => s.auth);
  const [user, setUser] = useState<IUser | null>(initUser ?? null);

  useLayoutEffect(() => {
    const id1 = apiClient.interceptors.request.use((cfg) => {
      if (token) {
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
      (error) => {
        if (error.status == 401) {
          console.warn("do refresh token....");
          dispatch(refreshAsync(refreshToken!));
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.response.eject(id2);
    };
  });

  useEffect(() => {
    dispatch(profileAsync()).then((response: any) => {
      const result = response.payload?.data?.results as IUser;
      if (result) {
        setUser({ ...result });
      }
    });
  }, [dispatch, token, refreshToken]);

  return {
    user,
    setUser,
    token,
    refreshToken,
    isLoading
  };
}
