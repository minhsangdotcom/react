export interface Response<T = any | Pagination> {
  status: number;
  message: string;
  results?: T | null;
}

export interface Pagination<T = any> {
  data: T;
  paging: PageInfo;
}

export interface PageInfo {
  currentPage?: number;
  pageSize: number;
  totalPage: number;
  totalItemCount?: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  before?: string;
  after?: string;
}
