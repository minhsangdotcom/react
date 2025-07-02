import IEntity from "../IEntity";

export interface IRole extends IEntity {
  name: string;
  description: string;
  guard: string;
  //roleClaims? : Array<IRoleClaim>
}

export interface IRoleClaim {
  id?: string;
  claimType: string;
  claimValue: string;
}
