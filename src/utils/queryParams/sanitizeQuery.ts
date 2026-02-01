import IQueryParam from "@/types/IQueryParam";
import { queryParser } from "./queryParser";
import { Params } from "@/types/Params";

export function sanitizeQuery(
  handlers: ((params: IQueryParam) => void)[],
  query: Params
): IQueryParam {
  const params = queryParser.parse(query);
  handlers.forEach((fn) => fn(params));
  return params;
}
