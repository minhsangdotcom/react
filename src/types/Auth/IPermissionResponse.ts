export default interface IPermissionResponse extends IPermissionBase {
  children: IPermissionBase[];
}

export interface IPermissionBase {
  claimType: string;
  claimValue: string;
}
