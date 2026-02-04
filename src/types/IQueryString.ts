type NestedFilterValue =
  | string
  | number
  | boolean
  | INestedFilterMap
  | INestedFilterMap[];

export interface INestedFilterMap {
  [key: string]: NestedFilterValue;
}

export interface QueryString {
  page?: number | null;
  pageSize?: number | null;
  before?: string | null;
  after?: string | null;
  keyword?: string | null;
  targets?: Array<string>;
  sort?: string | null;
  filter?: INestedFilterMap;
}
