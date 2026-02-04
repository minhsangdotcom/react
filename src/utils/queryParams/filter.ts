import { FilterGroup } from "@/types/QueryParam";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Filter from "@/types/IFilter";
dayjs.extend(utc);

const filterOperator = [
  "$eq",
  "$eqi",
  "$ne",
  "$nei",
  "$in",
  "$notin",
  "$lt",
  "$lte",
  "$gt",
  "$gte",
  "$between",
  "$notcontains",
  "$notcontainsi",
  "$contains",
  "$containsi",
  "$startswith",
  "$endswith",
];

const filterOperators = new Map<string, string>([
  ["isBetween", "$between"],
  ["eq", "$eq"],
  ["ne", "$ne"],
  ["lt", "$lt"],
  ["lte", "$lte"],
  ["gt", "$gt"],
  ["gte", "$gte"],
  ["iLike", "$containsi"],
  ["notILike", "$notcontainsi"],
  ["inArray", "$in"],
]);

const logicalOperators = new Map<string, string>([
  ["or", "$or"],
  ["and", "$and"],
]);

function parseValue(
  value: Array<string> | string,
  variant: string
): boolean | Array<string> | number | Array<number> | string {
  switch (variant) {
    case "dateRange":
    case "date": {
      const n = new Number(typeof value == "string" ? value : value[0]);
      const startDate = dayjs.utc(n as number).format();
      const dateRangeValue = [startDate];
      if (Array.isArray(value) && value.length > 1) {
        const unix = new Number(value[1]);
        const endDate = dayjs.utc(unix as number).format();
        dateRangeValue.push(endDate);
      }
      return dateRangeValue.length == 1 ? dateRangeValue[0] : dateRangeValue;
    }
    case "boolean":
      return value === "true";
    case "number":
    case "range": {
      const min = new Number(typeof value == "string" ? value : value[0]);
      const rangeValue = [min as number] as Array<number>;
      if (Array.isArray(value) && value.length > 1) {
        const max = new Number(value[1]);
        rangeValue.push(max as number);
      }
      return rangeValue.length == 1 ? rangeValue[0] : rangeValue;
    }
    case "text":
      return value as string;
    case "multiSelect":
      return value as Array<string>;
  }
  return value;
}

function createFilterItem(filter: Filter) {
  const value = parseValue(filter.value, filter.variant);
  const operator = filterOperators.get(filter.operator)!;
  const parts = filter.id.trim().split(".");
  let nested: any = { [operator]: value };
  for (let i = parts.length - 1; i >= 0; i--) {
    nested = { [parts[i]]: nested };
  }

  return nested;
}

export function parseFilter(filterGroup: FilterGroup) {
  try {
    let result = {} as any;
    const filters = filterGroup.filters;
    if (!filters) {
      return result;
    }

    if (filters.length == 1) {
      const filter = filters[0];
      if (!filterOperators.has(filter.operator)) {
        console.warn(
          `⚠️ Skipping filter with unsupported operator: ${filter.operator}`
        );
        return result;
      }
      const obj = createFilterItem(filter);
      result = obj;
      return result;
    }
    const logicalOperator = [] as Array<any>;
    for (let index = 0; index < filters.length; index++) {
      const filter = filters[index] as Filter;
      if (!filterOperators.has(filter.operator)) {
        console.warn(
          `⚠️ Skipping filter with unsupported operator: ${filter.operator}`
        );
        continue;
      }
      const item = createFilterItem(filter);
      if (item) {
        logicalOperator.push(item);
      }
    }
    const join = logicalOperators.get(filterGroup.combinator!) as string;
    result = {
      [join]: logicalOperator,
    } as any;
    return result;
  } catch (error) {
    throw error;
  }
}
