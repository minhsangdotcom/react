import { IPermissionGroupResponse } from "@/types/permission/IPermission";
import { send } from "@utils/http/api";
import { IApiResult } from "@utils/http/IApiResult";

const permissionService = {
  list: async function (
    signal?: AbortSignal
  ): Promise<IApiResult<IPermissionGroupResponse[]>> {
    return await send({
      url: "permissions",
      method: "GET",
      signal,
    });
  },
};
export default permissionService;
