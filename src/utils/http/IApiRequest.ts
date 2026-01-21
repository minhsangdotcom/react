import { Method } from "axios";

export default interface IApiRequest<T> {
  url: string;
  method: Method;
  data?: T | null;
  headers?: {};
}
