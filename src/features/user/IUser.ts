import { IPermissionResponse } from "@/types/permission/IPermission";
import { IRole } from "../role/IRole";
import { Gender } from "./Gender";
import { UserStatus } from "./UserStatus";
import IEntity from "@/types/IEntity";
import { IAuditable } from "@/types/IAuditable";

interface IUserBase {
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

export interface IUser extends IUserBase, IEntity {
  roles: Array<IRoleModel>;
  permissions?: Array<IPermissionModel>;
}

export interface IUserResponse extends IUserBase, IEntity, IAuditable {
  roles: Array<IRole>;
  permissions: Array<IPermissionResponse>;
}

export interface IRoleModel {
  id: string;
  name: string;
}

export interface IPermissionModel {
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
