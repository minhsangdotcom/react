export default interface IApiRequest<T> {
  url: string;
  method: string;
  data?: T | null;
  headers?: {};
}
