import { Method } from "axios";

export interface ApiRequest<T> {
  url: string;
  method: Method;
  data?: T | null;
  headers?: {};
  signal?: AbortSignal | null;
}
