import { IAuditable } from "../IAuditable";
import IEntity from "../IEntity";
import { IRole } from "../role/IRole";
import { Gender } from "./gender";
import IAddress from "./IAddress";
import { UserStatus } from "./userStatus";

export interface IUser extends IAuditable, IEntity {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  dayOfBirth: Date;
  gender: Gender;
  userAddress: IAddress;
  avatar: string | null;
  status: UserStatus;
  userClaims: Array<IUserClaim>;
  roles: Array<IRole>;
  address: string;
}

export interface IUserClaim extends IEntity {
  id: string;
  claimType: string;
  claimValue: string;
}
