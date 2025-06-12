import { ILoginRequest } from "../../types/Auth/ILoginRequest";
import { ILoginResponse } from "../../types/Auth/ILoginResponse";
import IResponse from "../../types/IResponse";
import api from "../../utils/api/http";
import {
  IBadRequestResponse,
  IErrorResponse,
  INotFoundResponse,
} from "../../types/IErrorResponse";

const authService = {
  login: async function (
    form: ILoginRequest
  ): Promise<
    | IResponse<ILoginResponse>
    | IErrorResponse<IBadRequestResponse>
    | IErrorResponse<INotFoundResponse>
    | null
  > {
    let result:
      | IResponse<ILoginResponse>
      | IErrorResponse<IBadRequestResponse>
      | IErrorResponse<INotFoundResponse>
      | null = null;
    try {
      const { data } = await api.post<IResponse<ILoginResponse>>(
        "users/login",
        form
      );
      result = data;
    } catch (error: any) {
      const data = error.response.data as
        | IErrorResponse<IBadRequestResponse>
        | IErrorResponse<INotFoundResponse>;
      result = data;
    } finally {
      return result;
    }
  },
};

export default authService;
