import { useEffect, useRef } from "react";
import { QueryParam } from "@/types/QueryParam";
import Filter from "@/types/IFilter";

function hasNotInfoValueChanged(prev: Filter[], next: Filter[]): boolean {
  const filterItems = next.filter((x) =>
    prev.some((p) => p.filterId === x.filterId)
  );
  for (let index = 0; index < filterItems.length; index++) {
    const newItem = filterItems[index];
    const current = prev.find((x) => x.filterId == newItem.filterId);

    if (
      current &&
      JSON.stringify(current.value) != JSON.stringify(newItem.value)
    ) {
      return false;
    }
  }

  const newItems = next.filter(
    (x) => !prev.some((p) => p.filterId === x.filterId)
  );

  return newItems.filter((x) => x.value === "").length === newItems.length;
}

export default function useDataFilterList(
  query: QueryParam | undefined,
  fn: () => void | Promise<void>,
  deps: React.DependencyList = []
) {
  const prevInfoRef = useRef<Filter[]>([]);
  const prevJoinOperatorRef = useRef<string>("");

  useEffect(() => {
    if (!query?.filter) {
      return;
    }

    const filters = query.filter.filters ?? [];
    const currentJoinOperator = query.filter.combinator ?? "and";

    const isSameFilter =
      filters.length > 0 &&
      hasNotInfoValueChanged(prevInfoRef.current, filters);

    const isSameJoinOperator =
      prevJoinOperatorRef.current === currentJoinOperator;

    if (isSameFilter && isSameJoinOperator) {
      return;
    }

    prevInfoRef.current = filters;
    prevJoinOperatorRef.current = currentJoinOperator;

    fn();
  }, [query, ...deps]);
}
