import IFilter from "@/src/types/IFilterType";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import IEntity from "@/src/types/IEntity";
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
  ["iLike", "$contains"],
]);

function parseValue(
  value: Array<string> | string,
  variant: string
): boolean | Array<string> | number | Array<number> | string {
  switch (variant) {
    case "dateRange":
    case "date":
      const n = new Number(typeof value == "string" ? value : value[0]);
      const startDate = dayjs.utc(n as number).format();
      const dateRangeValue = [startDate];
      if (Array.isArray(value) && value.length > 1) {
        const unix = new Number(value[1]);
        const endDate = dayjs.utc(unix as number).format();
        dateRangeValue.push(endDate);
      }
      return dateRangeValue.length == 1 ? dateRangeValue[0] : value;
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
  }
  return value;
}

function createFilterItem(filter: IFilter) {
  const value = parseValue(filter.value, filter.variant);
  const operator = filterOperators.get(filter.operator) ?? "$eq";

  const parts = filter.id.trim().split(".");
  let nested: any = { [operator]: value };

  for (let i = parts.length - 1; i >= 0; i--) {
    nested = { [parts[i]]: nested };
  }

  return nested;
}

export default function parseFilter(filters: Array<IFilter>) {
  let result = {} as any;
  if (filters.length == 1) {
    const obj = createFilterItem(filters[0]);
    result = obj;
    return result;
  }
  const $and = [] as Array<any>;
  for (let index = 0; index < filters.length; index++) {
    const filter = filters[index] as IFilter;
    $and.push(createFilterItem(filter));
  }
  result = { $and };
  return result;
}
