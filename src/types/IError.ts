export interface IErrorBase {
  type: string;
  title: string;
  status: number;
  instance: string;
  requestId: string;
  traceId: string;
  spanId: string;
}

export interface IError<T> extends IErrorBase {
  errorDetails: T;
}
export interface IValidationError<T> extends IErrorBase {
  invalidParams: T;
}

export interface IBadRequestError extends IError<IBadRequestMessage> {}

export interface INotFoundError extends IBadRequestError {}

export interface IUnauthorizedError extends IBadRequestError {}

export interface IForbiddenError extends IBadRequestError {}

interface IBadRequestMessage {
  message: string;
  en: string;
  vi: string;
}
