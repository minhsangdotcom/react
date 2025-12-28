import { IPermissionResponse } from "@/types/permission/IPermission";
import { IAuditable } from "../../types/IAuditable";
import IEntity from "../../types/IEntity";
import { IRole } from "../role/IRole";
import { Gender } from "./Gender";
import { UserStatus } from "./UserStatus";

export interface IUser extends IAuditable, IEntity {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: Gender;
  avatar: string | null;
  status: UserStatus;
  roles: Array<IRole>;
  permissions: Array<IPermissionResponse>
}
