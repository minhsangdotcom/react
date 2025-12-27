import { useLayoutEffect, useState } from "react";
import { IFilterParam, Params, defaultParams } from "../types/Params";
import queryString from "query-string";
import IFilter from "../types/IFilter";

function getFilterItems(filters: any): IFilterParam {
  if (!filters) {
    return {} as IFilterParam;
  }
  const filterObj = JSON.parse(filters as string) as Array<IFilter>;
  return {
    info: filterObj.map((filter) => ({
      id: filter.id,
      value: filter.value,
      operator: filter.operator,
      variant: filter.variant,
    })),
  };
}

export function useQueryParam() {
  const [query, setQuery] = useState<Params>();

  const updateQuery = () => {
    const queryParams = queryString.parse(window.location.search);
    const { filters, sort, page, perPage, previous, next } = queryParams;

    setQuery({
      filter: getFilterItems(filters),
      sort: sort
        ? JSON.parse(sort as string)
        : [{ id: "createdAt", desc: true }],
      page: page ? parseInt(page as string) : undefined,
      perPage: perPage ? parseInt(perPage as string) : defaultParams.perPage,
      pre: previous as string | undefined,
      next: next as string | undefined,
    });
  };

  useLayoutEffect(() => {
    updateQuery();

    const onPopState = () => {
      updateQuery();
    };

    window.addEventListener("popstate", onPopState);

    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = function (...args) {
      originalReplaceState.apply(window.history, args);
      onPopState();
    };

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  return {
    query,
    setQuery,
  };
}
