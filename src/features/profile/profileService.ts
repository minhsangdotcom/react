import { IBadRequestError, IForbiddenError, IUnauthorizedError } from "@/types/IError";
import IResponse from "@/types/IResponse";
import { IApiResult } from "@/utils/http/IApiResult";
import { IUserProfileResponse } from "./IUserProfile";
import { send } from "@/utils/http/api";

const profileService = {
getProfile: async function (): Promise<
    IApiResult<
      IResponse<IUserProfileResponse>,
      IBadRequestError | IForbiddenError | IUnauthorizedError
    >
  > {
    return await send({ url: "users/profile", method: "GET" });
  },
  updateProfile: async function (
    request: FormData
  ): Promise<
    IApiResult<
      IResponse<IUserProfileResponse>,
      IBadRequestError | IForbiddenError | IUnauthorizedError
    >
  > {
    return await send({
      url: "users/profile",
      method: "PUT",
      data: request,
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
}

export default profileService;