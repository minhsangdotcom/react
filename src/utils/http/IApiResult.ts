export interface IApiResult<TResult, TError> {
  isSuccess: boolean;
  data?: TResult | null;
  error?: TError | null;
}
