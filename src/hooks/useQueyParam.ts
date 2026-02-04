import { useEffect, useState } from "react";
import {
  FilterGroup,
  LogicalOperator,
  defaultParams,
  QueryParam
} from "@/types/FilterParam";
import queryString from "query-string";
import IFilter from "@/types/IFilter";

function getFilterItems(
  filters: string,
  joinOperator: LogicalOperator = "and"
): FilterGroup {
  if (!filters) {
    return {} as FilterGroup;
  }
  const filterObj = JSON.parse(filters) as Array<IFilter>;
  return {
    filters: filterObj.map((filter) => ({
      id: filter.id,
      value: filter.value,
      operator: filter.operator,
      variant: filter.variant,
      filterId: filter.filterId,
    })),
    combinator: joinOperator,
  };
}

export function useQueryParam() {
  const [query, setQuery] = useState<QueryParam>();

  const updateQuery = () => {
    const queryParams = queryString.parse(window.location.search);
    const { filters, sort, page, perPage, previous, next, joinOperator } =
      queryParams;

    setQuery({
      filter: getFilterItems(
        filters as string,
        joinOperator as LogicalOperator
      ),
      sort: sort
        ? JSON.parse(sort as string)
        : [{ id: "createdAt", desc: true }],
      page: page ? parseInt(page as string) : null,
      perPage: perPage ? parseInt(perPage as string) : defaultParams.perPage,
      before: previous as string | null,
      after: next as string | null,
    });
  };

  useEffect(() => {
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
