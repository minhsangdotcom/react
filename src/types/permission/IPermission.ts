import { IAuditable } from "../IAuditable";
import IEntity from "../IEntity";

// Model for form
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
//

// response for get all permissions api
interface INestedPermissionResponse extends IEntity {
  code: string;
  codeTranslation: string;
  children?: Array<INestedPermissionResponse>;
}

export interface IPermissionGroupResponse {
  name: string;
  nameTranslation: string;
  permissions: Array<INestedPermissionResponse>;
}
//

// response for permission inside role, user
export interface IPermissionResponse extends IEntity, IAuditable {
  code: string;
  name: string;
  group: string;
  description: string;
}
