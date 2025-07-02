export default interface IAxiosRequest<T> {
  url: string;
  method: string;
  data?: T | null;
  headers?: {};
}
