import { Auditable } from "@/types/IAuditable";
import { Entity } from "@/types/IEntity";
import { PermissionResponse } from "@/types/permission/IPermission";
import { RoleResponse } from "@/features/role/IRole";
import { Gender } from "../user/Gender";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string | null;
  avatar?: string | null;
  gender?: Gender;
}

export interface UserProfileResponse extends UserProfile, Entity, Auditable {
  username: string;
  status: number;
  roles: RoleResponse[];
  permissions: PermissionResponse[];
}
