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
import { showBadRequestToast } from "@/notifications/toastBadRequest";
import { showNotFoundToast } from "@/notifications/toastNotFound";
import { showNetworkErrorToast } from "@/notifications/toastNetworkError";
import ErrorType, { IBadRequestError } from "@/types/IError";

export function requestHandler(
  config: InternalAxiosRequestConfig<any>
): InternalAxiosRequestConfig<any> {
  // add bearer token to header
  tokenHandler(config);

  return config;
}

function toastError(error: AxiosError): void {
  if (!error.response) {
    showNetworkErrorToast();
    return;
  }

  const errorResult = error.response.data as any;

  switch (error.response.status) {
    case 400:
      if (errorResult?.["invalid-params"]?.length) {
        showBadRequestToast(
          errorResult["invalid-params"][0]?.reasons?.[0]?.description
        );
        return;
      }

      if (errorResult?.message?.translation) {
        showBadRequestToast(errorResult.message.translation);
        return;
      }

      showBadRequestToast();
      return;

    case 404:
      showNotFoundToast();
      return;

    case 500:
      showServerErrorToast();
      return;
  }
}

export async function errorResponseHandler(
  error: AxiosError,
  api: AxiosInstance
): Promise<any> {
  toastError(error);
  // handle refreshing token
  await refreshTokenHandler(error, api);

  return Promise.reject(error);
}
