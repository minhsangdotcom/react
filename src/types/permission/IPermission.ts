import { IAuditable } from "../IAuditable";
import IEntity from "../IEntity";

export interface IPermission extends IEntity {
  code: string;
  label: string;
  checked: boolean;
  expanded: boolean;
  permissionId: string;
  inherited?: boolean;
  children: IPermission[];
}

export interface IPermissionGroup {
  name: string;
  label: string;
  permissions: IPermission[];
}

export interface INestedPermission extends IEntity {
  code: string;
  codeTranslation: string;
  children?: Array<INestedPermission>;
}

export interface IGroupPermissionResponse {
  name: string;
  nameTranslation: string;
  permissions: Array<INestedPermission>;
}

export interface IPermissionResponse extends IEntity, IAuditable {
  code: string;
  group: string;
  description: string; 
  children: IPermissionResponse[];
}
