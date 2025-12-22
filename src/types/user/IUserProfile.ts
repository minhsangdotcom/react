import { IAuditable } from "../IAuditable";
import IEntity from "../IEntity";
import { IPermissionResponse } from "../permission/IPermission";
import { IRoleResponse } from "../role/IRole";
import { Gender } from "./gender";

export interface IUserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string | null;
  avatar?: string | null;
  gender?: Gender;
}

export interface IUserProfileResponse
  extends IUserProfile,
    IEntity,
    IAuditable {
  username: string;
  status: number;
  roles: IRoleResponse[];
  permissions : IPermissionResponse[];
}
