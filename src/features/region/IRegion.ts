import { Auditable } from "../../types/IAuditable";
import {Entity} from "../../types/IEntity";

interface Region extends Auditable, Entity {
  code: string;
  name: string;
  englishName: string;
  fullName: string;
  englishFullName: string;
  customName: string;
}

export interface Province extends Region {}
export interface District extends Region {}
export interface Commune extends Region {}
