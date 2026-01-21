export default interface IResponse<T> {
  status: number;
  message: string;
  results: T | null;
}

export interface IPagination<T> {
  data: T;
  paging: IPageInfo;
}

export interface IPageInfo {
  currentPage?: number;
  pageSize: number;
  totalPage: number;
  totalItemCount? : number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  before?: string;
  after?: string;
}
