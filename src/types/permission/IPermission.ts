import { Auditable } from "../IAuditable";
import { Entity } from "../IEntity";

// Model for form
export interface Permission extends Entity {
  code: string;
  label: string;
  checked: boolean;
  expanded: boolean;
  permissionId: string;
  inherited?: boolean;
  children: Permission[];
}

export interface PermissionGroup {
  name: string;
  label: string;
  permissions: Permission[];
}
//

// response for get all permissions api
interface NestedPermissionResponse extends Entity {
  code: string;
  codeTranslation: string;
  children?: NestedPermissionResponse[];
}

export interface PermissionGroupResponse {
  name: string;
  nameTranslation: string;
  permissions: NestedPermissionResponse[];
}
//

// response for permission inside role, user
export interface PermissionResponse extends Entity, Auditable {
  code: string;
  name: string;
  group: string;
  description: string;
}
