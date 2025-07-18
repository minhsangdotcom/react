import { IRoleClaim } from "./IRole";

export default interface ICreateRoleRequest {
  name: string;
  description: string;
  roleClaims: Array<IRoleClaim>;
}
