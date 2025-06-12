import { IAuditable } from "../IAuditable";
import IEntity from "../IEntity";

export default interface IUser extends IAuditable, IEntity {
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