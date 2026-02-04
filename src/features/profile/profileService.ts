import { ApiResult } from "@/lib/http/IApiResult";
import { UserProfileResponse } from "./IUserProfile";
import { send } from "@/lib/http/api";

const profileService = {
  getProfile: async function (): Promise<ApiResult<UserProfileResponse>> {
    return await send({ url: "users/profile", method: "GET" });
  },
  updateProfile: async function (
    request: FormData
  ): Promise<ApiResult<UserProfileResponse>> {
    return await send({
      url: "users/profile",
      method: "PUT",
      data: request,
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default profileService;
