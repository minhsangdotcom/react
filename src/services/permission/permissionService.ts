import IResponse from "@/types/IResponse";
import { IGroupPermissionResponse } from "@/types/permission/IPermission";
import { send } from "@utils/http/api";
import { IApiResult } from "@utils/http/IApiResult";

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
