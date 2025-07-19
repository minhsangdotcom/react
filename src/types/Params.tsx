import IFilter from "./IFilterType";

export type Params = {
  filter: IFilterParam;
  sort: Array<{ id: string; desc: boolean }> | [];
  page?: number;
  pre?: string;
  next?: string;
  perPage: number;
};

export const defaultParams: Params = {
  filter: { logicalOperator: undefined, info: [] },
  sort: [{ id: "createdAt", desc: true }],
  page: undefined,
  pre: undefined,
  next: undefined,
  perPage: 1,
};

export interface IFilterParam {
  logicalOperator?: string;
  info: Array<IFilter> | [];
}
