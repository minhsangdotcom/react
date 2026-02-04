import ErrorType from "@/types/IError";
import { Pagination, Response } from "@/types/IResponse";

export interface ApiResult<T = any | Pagination> {
  success: boolean;
  status?: number;
  data?: Response<T> | null;
  error?: ErrorType | null;
}
