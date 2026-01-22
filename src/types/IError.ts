export interface IError {
  type: string;
  title: string;
  status: number;
  instance: string;
  requestId: string;
  traceId: string;
  spanId: string;
  detail: string;
}

export interface IInternalServerError extends IError {}

export interface IValidationError extends IError {
  invalidParams: IInvalidParam;
  message: IMessage;
}
export interface IBadRequestError extends IError {
  message: IMessage;
}
export interface INotFoundError extends IBadRequestError {
  message: IMessage;
}
export interface IUnauthorizedError extends IError {
  message: IMessage;
}
export interface IForbiddenError extends IError {
  message: IMessage;
}

interface IMessage {
  message: string;
  translation: string;
}

interface IInvalidParam {
  code: string;
  description: string;
}

type ErrorType =
  | IBadRequestError
  | INotFoundError
  | IUnauthorizedError
  | IForbiddenError
  | IValidationError
  | IInternalServerError;

export default ErrorType;
