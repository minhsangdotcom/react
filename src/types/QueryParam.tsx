import IFilter from "./IFilter";

export interface QueryParam {
  filter: FilterGroup;
  sort: Sort[] | [];
  page?: number | null;
  before?: string | null;
  after?: string | null;
  perPage: number;
}
export type LogicalOperator = "and" | "or";

export interface FilterGroup {
  combinator?: LogicalOperator | null;
  filters: IFilter[];
}

export type Sort = {
  id: string;
  desc: boolean;
};

export const defaultParams = {
  filter: { combinator: null, filters: [] },
  sort: [{ id: "createdAt", desc: true }],
  page: null,
  before: null,
  after: null,
  perPage: 5,
} as const;

export const ROW_PER_PAGE = [5, 10, 20, 30, 40, 50];
