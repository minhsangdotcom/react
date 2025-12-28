import { IAuditable } from "../../types/IAuditable";
import IEntity from "../../types/IEntity";

export default interface IUserResponse extends IAuditable, IEntity {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  dayOfBirth: Date;
  gender: number;
  address: string;
  avatar: string;
  status: number;
}
