import {
  IBadRequestError,
  IForbiddenError,
  INotFoundError,
  IUnauthorizedError,
  IValidationError,
} from "@/types/IError";
import IResponse, { IPagination } from "@/types/IResponse";

export interface IApiResult<T = any | IPagination> {
  success: boolean;
  status?: number;
  data?: IResponse<T> | null;
  error?:
    | IBadRequestError
    | INotFoundError
    | IUnauthorizedError
    | IForbiddenError
    | IValidationError
    | null;
}
