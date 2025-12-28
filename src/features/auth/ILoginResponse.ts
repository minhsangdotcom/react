import { ITokenResponse } from "./ITokenResponse";

export interface ILoginResponse extends ITokenResponse {
  tokenType: string;
  accessTokenExpiredIn: number;
  user: IAuthUserResponse;
}

export interface IAuthUserResponse {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: number;
  avatar: string | null;
  status: number;
}
