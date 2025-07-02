import { IUser } from "../user/IUser";
import { ITokenResponse } from "./ITokenResponse";

export interface ILoginResponse extends ITokenResponse {
  tokenType: string;
  accessTokenExpiredIn: number;
  user: IUser,
}
