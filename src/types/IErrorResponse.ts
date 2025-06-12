export interface IErrorResponse<T> {
  type: string;
  title: string;
  status: number;
  instance: string;
  ErrorDetail: T;
  requestId: string;
  traceId: string;
  spanId: string;
}

export interface IBadRequestResponse {
  message: string;
  en: string;
  vi: string;
}

export interface INotFoundResponse extends IBadRequestResponse {}
