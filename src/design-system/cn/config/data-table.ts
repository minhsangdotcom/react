import { TRANSLATION_KEYS } from "@/config/translationKey";

export type DataTableConfig = typeof dataTableConfig;

export const dataTableConfig = {
  // textOperators: [
  //   { label: "Contains", value: "iLike" as const },
  //   { label: "Does not contain", value: "notILike" as const },
  //   { label: "Is", value: "eq" as const },
  //   { label: "Is not", value: "ne" as const },
  //   { label: "Is empty", value: "isEmpty" as const },
  //   { label: "Is not empty", value: "isNotEmpty" as const },
  // ]
  textOperators: [
    {
      label: TRANSLATION_KEYS.common.table.toolbar.filter.operators.iLike,
      value: "iLike",
    },
    {
      label: TRANSLATION_KEYS.common.table.toolbar.filter.operators.notILike,
      value: "notILike",
    },
    {
      label: TRANSLATION_KEYS.common.table.toolbar.filter.operators.eq,
      value: "eq",
    },
    {
      label: TRANSLATION_KEYS.common.table.toolbar.filter.operators.ne,
      value: "ne",
    },
    {
      label: TRANSLATION_KEYS.common.table.toolbar.filter.operators.isEmpty,
      value: "isEmpty",
    },
    {
      label: TRANSLATION_KEYS.common.table.toolbar.filter.operators.isNotEmpty,
      value: "isNotEmpty",
    },
  ],
  // numericOperators: [
  //   { label: "Is", value: "eq" as const },
  //   { label: "Is not", value: "ne" as const },
  //   { label: "Is less than", value: "lt" as const },
  //   { label: "Is less than or equal to", value: "lte" as const },
  //   { label: "Is greater than", value: "gt" as const },
  //   { label: "Is greater than or equal to", value: "gte" as const },
  //   { label: "Is between", value: "isBetween" as const },
  //   { label: "Is empty", value: "isEmpty" as const },
  //   { label: "Is not empty", value: "isNotEmpty" as const },
  // ],
  numericOperators: [
    {
      label: TRANSLATION_KEYS.common.table.toolbar.filter.operators.eq,
      value: "eq",
    },
    {
      label: TRANSLATION_KEYS.common.table.toolbar.filter.operators.ne,
      value: "ne",
    },
    {
      label: TRANSLATION_KEYS.common.table.toolbar.filter.operators.lt,
      value: "lt",
    },
    {
      label: TRANSLATION_KEYS.common.table.toolbar.filter.operators.lte,
      value: "lte",
    },
    {
      label: TRANSLATION_KEYS.common.table.toolbar.filter.operators.gt,
      value: "gt",
    },
    {
      label: TRANSLATION_KEYS.common.table.toolbar.filter.operators.gte,
      value: "gte",
    },
    {
      label: TRANSLATION_KEYS.common.table.toolbar.filter.operators.isBetween,
      value: "isBetween",
    },
    {
      label: TRANSLATION_KEYS.common.table.toolbar.filter.operators.isEmpty,
      value: "isEmpty",
    },
    {
      label: TRANSLATION_KEYS.common.table.toolbar.filter.operators.isNotEmpty,
      value: "isNotEmpty",
    },
  ],
  // dateOperators: [
  //   { label: "Is", value: "eq" as const },
  //   { label: "Is not", value: "ne" as const },
  //   { label: "Is before", value: "lt" as const },
  //   { label: "Is after", value: "gt" as const },
  //   { label: "Is on or before", value: "lte" as const },
  //   { label: "Is on or after", value: "gte" as const },
  //   { label: "Is between", value: "isBetween" as const },
  //   { label: "Is relative to today", value: "isRelativeToToday" as const },
  //   { label: "Is empty", value: "isEmpty" as const },
  //   { label: "Is not empty", value: "isNotEmpty" as const },
  // ],
  // selectOperators: [
  //   { label: "Is", value: "eq" as const },
  //   { label: "Is not", value: "ne" as const },
  //   { label: "Is empty", value: "isEmpty" as const },
  //   { label: "Is not empty", value: "isNotEmpty" as const },
  // ],
  // multiSelectOperators: [
  //   { label: "Has any of", value: "inArray" as const },
  //   { label: "Has none of", value: "notInArray" as const },
  //   { label: "Is empty", value: "isEmpty" as const },
  //   { label: "Is not empty", value: "isNotEmpty" as const },
  // ],
  // booleanOperators: [
  //   { label: "Is", value: "eq" as const },
  //   { label: "Is not", value: "ne" as const },
  // ],
  dateOperators: [
    { label: "common.table.toolbar.filter.operators.eq", value: "eq" as const },
    { label: "common.table.toolbar.filter.operators.ne", value: "ne" as const },
    { label: "common.table.toolbar.filter.operators.lt", value: "lt" as const },
    { label: "common.table.toolbar.filter.operators.gt", value: "gt" as const },
    {
      label: "common.table.toolbar.filter.operators.lte",
      value: "lte" as const,
    },
    {
      label: "common.table.toolbar.filter.operators.gte",
      value: "gte" as const,
    },
    {
      label: "common.table.toolbar.filter.operators.isBetween",
      value: "isBetween" as const,
    },
    {
      label: "common.table.toolbar.filter.operators.isRelativeToToday",
      value: "isRelativeToToday" as const,
    },
    {
      label: "common.table.toolbar.filter.operators.isEmpty",
      value: "isEmpty" as const,
    },
    {
      label: "common.table.toolbar.filter.operators.isNotEmpty",
      value: "isNotEmpty" as const,
    },
  ],

  selectOperators: [
    { label: "common.table.toolbar.filter.operators.eq", value: "eq" as const },
    { label: "common.table.toolbar.filter.operators.ne", value: "ne" as const },
    {
      label: "common.table.toolbar.filter.operators.isEmpty",
      value: "isEmpty" as const,
    },
    {
      label: "common.table.toolbar.filter.operators.isNotEmpty",
      value: "isNotEmpty" as const,
    },
  ],

  multiSelectOperators: [
    {
      label: "common.table.toolbar.filter.operators.inArray",
      value: "inArray" as const,
    },
    {
      label: "common.table.toolbar.filter.operators.notInArray",
      value: "notInArray" as const,
    },
    {
      label: "common.table.toolbar.filter.operators.isEmpty",
      value: "isEmpty" as const,
    },
    {
      label: "common.table.toolbar.filter.operators.isNotEmpty",
      value: "isNotEmpty" as const,
    },
  ],

  booleanOperators: [
    { label: "common.table.toolbar.filter.operators.eq", value: "eq" as const },
    { label: "common.table.toolbar.filter.operators.ne", value: "ne" as const },
  ],
  // sortOrders: [
  //   { label: "Asc", value: "asc" as const },
  //   { label: "Desc", value: "desc" as const },
  // ],
  sortOrders: [
    {
      label: TRANSLATION_KEYS.common.table.toolbar.sort.direction.asc,
      value: "asc",
    },
    {
      label: TRANSLATION_KEYS.common.table.toolbar.sort.direction.desc,
      value: "desc",
    },
  ],
  filterVariants: [
    "text",
    "number",
    "range",
    "date",
    "dateRange",
    "boolean",
    "select",
    "multiSelect",
  ] as const,
  operators: [
    "iLike",
    "notILike",
    "eq",
    "ne",
    "inArray",
    "notInArray",
    "isEmpty",
    "isNotEmpty",
    "lt",
    "lte",
    "gt",
    "gte",
    "isBetween",
    "isRelativeToToday",
  ] as const,
  joinOperators: ["and", "or"] as const,
};
