import { IAuditable } from "@/types/IAuditable";
import IEntity from "@/types/IEntity";
import { IPermissionResponse } from "@/types/permission/IPermission";
import { IRoleResponse } from "@/types/role/IRole";
import { Gender } from "../../types/user/Gender";

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
