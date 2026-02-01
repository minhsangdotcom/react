import IQueryParam from "@/types/IQueryParam";

export function sanitizeSearchQuery(
  query: IQueryParam,
  searchTerm: string,
  target: string[]
) : void{
  if (searchTerm !== "") {
    query.keyword = searchTerm;
    query.targets = target;
  }
}
