import { IPermissionGroupResponse } from "@/types/permission/IPermission";
import { send } from "@/lib/http/api";
import { ApiResult } from "@/lib/http/IApiResult";

const permissionService = {
  list: async function (
    signal?: AbortSignal
  ): Promise<ApiResult<IPermissionGroupResponse[]>> {
    return await send({
      url: "permissions",
      method: "GET",
      signal,
    });
  },
};
export default permissionService;
