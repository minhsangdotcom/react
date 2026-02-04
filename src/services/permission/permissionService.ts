import { IPermissionGroupResponse } from "@/types/permission/IPermission";
import { send } from "@/lib/http/api";
import { IApiResult } from "@/lib/http/IApiResult";

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
