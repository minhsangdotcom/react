import { IAuditable } from "../IAuditable";
import IEntity from "../IEntity";
import { IPermissionResponse } from "../permission/IPermission";

export interface IRole extends IEntity, IAuditable {
  name: string;
  description: string;
}

export interface IRoleRequest {
  name: string;
  description: string;
  permissions: Array<IPermissionResponse>;
}

export interface IRoleResponse extends IRole {
  permissions: Array<IPermissionResponse>;
}

export interface IRoleClaim {
  id?: string;
  claimType: string;
  claimValue: string;
}
