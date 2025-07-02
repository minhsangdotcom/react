import { useLayoutEffect, useState } from "react";
import { Params } from "../types/Params";
import queryString from "query-string";
import IFilter from "../types/IFilterType";

function getFilterItems(filters: any): Array<IFilter> | [] {
  if (!filters) {
    return [];
  }
  const filterObj = JSON.parse(filters as string) as Array<IFilter>;
  return filterObj.map((filter) => ({
    id: filter.id,
    value: filter.value,
    operator: filter.operator,
    variant: filter.variant,
  }));
}

export function useQueryParam() {
  const [query, setQuery] = useState<Params>();
  console.log("🚀 ~ RolePage ~ query:", query);

  useLayoutEffect(() => {
    const queryParams = queryString.parse(window.location.search);
    const { filters, sort, page, perPage } = queryParams;
    setQuery((pre) => ({
      ...pre,
      filter: getFilterItems(filters),
      sort: sort
        ? JSON.parse(sort! as string)
        : [{ id: "createdAt", desc: true }],
      page: page ? parseInt(page! as string) : 1,
      perPage: perPage ? parseInt(perPage! as string) : 10,
    }));
  }, [window.location.search]);

  return {
    query,
    setQuery,
  };
}
