import IFilter from "./IFilter";

export type Params = {
  filter: IFilterParam;
  sort: Array<{ id: string; desc: boolean }> | [];
  page?: number | null;
  before?: string | null;
  after?: string | null;
  perPage: number;
};

export const defaultParams: Params = {
  filter: { logicalOperator: undefined, info: [] },
  sort: [{ id: "createdAt", desc: true }],
  page: null,
  before: null,
  after: null,
  perPage: 5,
} as const;

export interface IFilterParam {
  logicalOperator?: string;
  info: Array<IFilter> | [];
}

export const ROW_PER_PAGE = [5, 10, 20, 30, 40, 50];
