import ErrorType from "@/types/IError";
import IResponse from "@/types/IResponse";
import { IApiResult } from "@/utils/http/IApiResult";
import { useState, useCallback } from "react";

interface UseApiState<T = any | IResponse> {
  data?: T | null;
  loading: boolean;
  error?: ErrorType | null;
}

export const useApi = <T = any | IResponse>() => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (apiCall: () => Promise<any>): Promise<IApiResult<T>> => {
      setState({ data: null, loading: true, error: null });

      const response = await apiCall();
      setState((pre) => ({ ...pre, loading: false }));

      const result: IApiResult<T> = response;
      if (!result.success) {
        setState((pre) => ({ ...pre, error: result.error }));
      } else {
        setState((pre) => ({ ...pre, data: result.data?.results }));
      }
      return result;
    },
    []
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};
