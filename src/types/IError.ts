export interface Error {
  type: string;
  title: string;
  status: number;
  instance: string;
  requestId: string;
  traceId: string;
  spanId: string;
  detail: string;
}

export interface InternalServerError extends Error {}

export interface ValidationError extends Error {
  invalidParams: InvalidParam;
  message: Message;
}
export interface BadRequestError extends Error {
  message: Message;
}
export interface NotFoundError extends BadRequestError {
  message: Message;
}
export interface UnauthorizedError extends Error {
  message: Message;
}
export interface ForbiddenError extends Error {
  message: Message;
}

interface Message {
  message: string;
  translation: string;
}

interface InvalidParam {
  code: string;
  description: string;
}

type ErrorType =
  | BadRequestError
  | NotFoundError
  | UnauthorizedError
  | ForbiddenError
  | ValidationError
  | InternalServerError;

export default ErrorType;
