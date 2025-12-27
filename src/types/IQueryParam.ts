type NestedFilterValue = string | number | boolean | INestedFilterMap;

interface INestedFilterMap {
  [key: string]: NestedFilterValue;
}

export default interface IQueryParam {
  page?: number;
  pageSize?: number;
  before?: string;
  after?: string;
  keyword?: string;
  targets?: Array<string>;
  sort?:string,
  filter?: INestedFilterMap;
}
