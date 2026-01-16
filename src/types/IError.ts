export interface IError {
  type: string;
  title: string;
  status: number;
  instance: string;
  requestId: string;
  traceId: string;
  spanId: string;
  detail: string;
  message: IMessage;
}
export interface IValidationError extends IError {
  invalidParams: IInvalidParam;
}

export interface IBadRequestError extends IError {}

export interface INotFoundError extends IBadRequestError {}

export interface IUnauthorizedError extends IError {}

export interface IForbiddenError extends IError {}

interface IMessage {
  message: string;
  translation: string;
}

interface IInvalidParam {
  code: string;
  description: string;
}
