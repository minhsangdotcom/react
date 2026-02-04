import { QueryString } from "@/types/IQueryString";
import { queryParser } from "./queryParser";
import { QueryParam } from "@/types/QueryParam";

export function sanitizeQuery(
  queryParams: QueryParam,
  ...fns: Array<(query: QueryString) => void>
): QueryString {
  const query = queryParser.parse(queryParams);
  if (!query) {
    throw new Error("Invalid query params");
  }
  
  fns.forEach((fn) => {
    fn(query);
  });

  return query;
}
