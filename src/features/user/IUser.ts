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
  phoneNumber: string;
  password: string;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  avatar: string | null;
  status: UserStatus;
}

export interface IUser extends IUserBase, IEntity {
  roles: Array<{ id: string; name: string }>;
  permissions?: Array<{ id: string; code: string }>;
}

export interface IUserResponse extends IUserBase, IEntity, IAuditable {
  roles: Array<IRole>;
  permissions: Array<IPermissionResponse>;
}

const DefaultIUser = {
  id: "",
  createdAt: new Date(),
  firstName: "",
  lastName: "",
  gender: Gender.Male,
  dateOfBirth: "2009-01-10",
  email: "",
  phoneNumber: "",
  username: "",
  password: "",
  status: UserStatus.Active,
  roles: [],
  permissions: [],
  avatar: "/images/avatar-boy.png",
};
export default DefaultIUser;