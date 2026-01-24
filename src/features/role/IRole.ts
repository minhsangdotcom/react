import { IAuditable } from "@/types/IAuditable";
import IEntity from "@/types/IEntity";
import { IPermissionResponse } from "../../types/permission/IPermission";

export interface IRole extends IEntity {
  name: string;
  description?: string | null;
}

export interface IRoleRequest {
  name: string;
  description?: string | null;
  permissionIds: Array<string>;
}

export interface IRoleResponse extends IRole, IAuditable {
  permissions: Array<IPermissionResponse>;
}
