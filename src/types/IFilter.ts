// =====================
// Variants
// =====================
export type FilterVariant =
  | "text"
  | "number"
  | "date"
  | "boolean"
  | "select";

// =====================
// Operators by variant
// =====================
export type TextOperator =
  | "eq"
  | "neq"
  | "contains"
  | "ncontains"
  | "startsWith"
  | "endsWith"
  | "in";

export type NumberOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "between"
  | "in";

export type DateOperator =
  | "eq"
  | "before"
  | "after"
  | "between"
  | "today"
  | "yesterday"
  | "thisWeek"
  | "thisMonth"
  | "thisYear";

export type BooleanOperator = "eq";

export type SelectOperator =
  | "eq"
  | "neq"
  | "in"
  | "nin";

// =====================
// Union operator
// =====================
export type FilterOperator =
  | TextOperator
  | NumberOperator
  | DateOperator
  | BooleanOperator
  | SelectOperator;

export default interface Filter {
  id: string;
  value: string | string[];
  variant: FilterVariant;
  operator: FilterOperator;
  filterId: string;
}