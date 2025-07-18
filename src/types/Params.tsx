import IFilter from "./IFilterType";

export type Params = {
  filter: Array<IFilter> | [];
  sort: Array<{ id: string; desc: boolean }> | [];
  page: number;
  perPage: number;
};

export const defaultParams: Params = {
  filter: [],
  sort: [{ id: "createdAt", desc: true }],
  page: 1,
  perPage: 10,
};
