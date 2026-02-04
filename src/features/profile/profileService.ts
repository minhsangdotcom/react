import { IApiResult } from "@/lib/http/IApiResult";
import { IUserProfileResponse } from "./IUserProfile";
import { send } from "@/lib/http/api";

const profileService = {
  getProfile: async function (): Promise<IApiResult<IUserProfileResponse>> {
    return await send({ url: "users/profile", method: "GET" });
  },
  updateProfile: async function (
    request: FormData
  ): Promise<IApiResult<IUserProfileResponse>> {
    return await send({
      url: "users/profile",
      method: "PUT",
      data: request,
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default profileService;
