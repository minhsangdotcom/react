import { Auditable } from "@/types/IAuditable";
import { Entity } from "@/types/IEntity";
import { PermissionResponse } from "../../types/permission/IPermission";

export interface Role extends Entity {
  name: string;
  description?: string | null;
}

export interface RoleRequest {
  name: string;
  description?: string | null;
  permissionIds: string[];
}

export interface RoleResponse extends Role, Auditable {
  permissions: PermissionResponse[];
}
