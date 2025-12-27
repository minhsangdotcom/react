import IResponse from "@/src/types/IResponse";
import { IGroupPermissionResponse } from "@/src/types/permission/IPermission";
import { send } from "@/src/utils/http/api";
import { IApiResult } from "@/src/utils/http/IApiResult";

const permissionService = {
  listPermission: async function (): Promise<
    IApiResult<IResponse<Array<IGroupPermissionResponse>>, void>
  > {
    return await send({
      url: "permissions",
      method: "GET",
    });
  },
};
export default permissionService;
