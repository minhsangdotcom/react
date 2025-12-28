import { IAuditable } from "../IAuditable";
import IEntity from "../IEntity";
import { IRole } from "../../features/role/IRole";
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
}

export interface IUserClaim extends IEntity {
  id: string;
  claimType: string;
  claimValue: string;
}
