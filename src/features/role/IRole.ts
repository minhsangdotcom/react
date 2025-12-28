import { IAuditable } from "@/types/IAuditable";
import IEntity from "@/types/IEntity";
import { IPermissionResponse } from "../../types/permission/IPermission";

export interface IRole extends IEntity, IAuditable {
  name: string;
  description: string;
}

export interface IRoleRequest {
  name: string;
  description: string;
  permissionIds: Array<string>;
}

export interface IRoleResponse extends IRole {
  permissions: Array<IPermissionResponse>;
}

export interface IRoleClaim {
  id?: string;
  claimType: string;
  claimValue: string;
}
