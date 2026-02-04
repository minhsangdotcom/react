import { TokenResponse } from "./ITokenResponse";

export interface LoginResponse extends TokenResponse {
  tokenType: string;
  accessTokenExpiredIn: number;
  user: AuthUserResponse;
}

export interface AuthUserResponse {
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
