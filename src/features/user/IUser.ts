import { PermissionResponse } from "@/types/permission/IPermission";
import { Role } from "../role/IRole";
import { Gender } from "./Gender";
import { UserStatus } from "./UserStatus";
import { Entity } from "@/types/IEntity";
import { Auditable } from "@/types/IAuditable";

interface UserBase {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber?: string | null;
  password: string;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  avatar: string | null;
  status: UserStatus;
}

export interface User extends UserBase, Entity {
  roles: RoleModel[];
  permissions?: PermissionModel[];
}

export interface UserResponse extends UserBase, Entity, Auditable {
  roles: Role[];
  permissions: PermissionResponse[];
}

export interface RoleModel {
  id: string;
  name: string;
}

export interface PermissionModel {
  id: string;
  code: string;
}

const DefaultUser = {
  id: "",
  createdAt: "",
  firstName: "",
  lastName: "",
  gender: null,
  dateOfBirth: null,
  email: "",
  phoneNumber: null,
  username: "",
  password: "",
  status: UserStatus.Active,
  roles: [],
  permissions: [],
  avatar: null,
};

export default DefaultUser;
