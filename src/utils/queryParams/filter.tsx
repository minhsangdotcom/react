import IFilter from "@/types/IFilter";
import { IFilterParam } from "@/types/Params";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
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
  ["inArray", "$in"],
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

function createFilterItem(filter: IFilter) {
  const value = parseValue(filter.value, filter.variant);
  console.log("🚀 ~ createFilterItem ~ value:", value);
  const operator = filterOperators.get(filter.operator) ?? "$eq";
  const parts = filter.id.trim().split(".");

  let nested: any = { [operator]: value };
  for (let i = parts.length - 1; i >= 0; i--) {
    nested = { [parts[i]]: nested };
  }

  return nested;
}

export default function parseFilter(filters: IFilterParam) {
  let result = {} as any;
  const infoFilter = filters.info;
  if (infoFilter == undefined) {
    return result;
  }

  if (infoFilter.length == 1) {
    const obj = createFilterItem(infoFilter[0]);
    result = obj;
    return result;
  }
  const logicalOperator = [] as Array<any>;
  for (let index = 0; index < infoFilter.length; index++) {
    const filter = infoFilter[index] as IFilter;
    logicalOperator.push(createFilterItem(filter));
  }

  result = {
    [filters.logicalOperator ? filters.logicalOperator : "$and"]:
      logicalOperator,
  } as any;
  return result;
}
