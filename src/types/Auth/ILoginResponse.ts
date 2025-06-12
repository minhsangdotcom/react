import IUser from "./User";

export interface ILoginResponse {
  tokenType: string;
  accessTokenExpiredIn: number;
  token: string;
  refresh: string;
  user: IUser,
}
