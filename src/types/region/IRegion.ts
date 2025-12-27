import { IAuditable } from "../IAuditable";
import IEntity from "../IEntity";

interface IRegion extends IAuditable, IEntity {
  code: string;
  name: string;
  englishName: string;
  fullName: string;
  englishFullName: string;
  customName: string;
}

export interface IProvince extends IRegion {}
export interface IDistrict extends IRegion {}
export interface ICommune extends IRegion {}
