import IFilter from "@/types/IFilter";
import { useEffect, useRef } from "react";
import { Params } from "@/types/Params";

function hasNotInfoValueChanged(prev: IFilter[], next: IFilter[]): boolean {
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
  query: Params | undefined,
  fn: () => void | Promise<void>,
  deps: React.DependencyList = []
) {
  const prevInfoRef = useRef<IFilter[]>([]);
  const prevJoinOperatorRef = useRef<string>("");

  useEffect(() => {
    if (!query?.filter) {
      return;
    }

    const currentInfo = query.filter.info ?? [];
    const currentJoinOperator = query.filter.logicalOperator ?? "and";

    const isSameInfo =
      currentInfo.length > 0 &&
      hasNotInfoValueChanged(prevInfoRef.current, currentInfo);

    const isSameJoinOperator =
      prevJoinOperatorRef.current === currentJoinOperator;

    if (isSameInfo && isSameJoinOperator) {
      return;
    }

    prevInfoRef.current = currentInfo;
    prevJoinOperatorRef.current = currentJoinOperator;

    fn();
  }, [query, ...deps]);
}
