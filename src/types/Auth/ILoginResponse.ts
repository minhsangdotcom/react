import { ITokenResponse } from "./ITokenResponse";
import IUser from "./IUserResponse";

export interface ILoginResponse extends ITokenResponse {
  tokenType: string;
  accessTokenExpiredIn: number;
  user: IUser,
}
