import { QueryString } from "@/types/IQueryString";

export function sanitizeSearchQuery(
  query: QueryString,
  searchTerm: string,
  target: string[]
): void {
  if (searchTerm !== "") {
    query.keyword = searchTerm;
    query.targets = target;
  }
}
