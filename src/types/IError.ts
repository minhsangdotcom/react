export interface IError<T> {
  type: string;
  title: string;
  status: number;
  instance: string;
  ErrorDetail: T;
  requestId: string;
  traceId: string;
  spanId: string;
}

export interface IBadRequestError extends IError<IBadRequestMessage> {}

export interface INotFoundError extends IBadRequestError {}

export interface IUnauthorizedError extends IError<string> {}

export interface IForbiddenError extends IError<string> {}

interface IBadRequestMessage {
  message: string;
  en: string;
  vi: string;
}
