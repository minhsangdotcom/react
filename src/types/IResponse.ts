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
  currentPage: 0;
  pageSize: 0;
  totalPage: 0;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  before: "string";
  after: "string";
}
