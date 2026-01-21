export interface IApiResult<TResult, TError> {
  success: boolean;
  status?: number;
  data?: TResult | null;
  error?: TError | null;
}
