import { defaultParams, QueryParam } from "@/types/FilterParam";
import { QueryString } from "@/types/IQueryString";
import { parseFilter } from "@utils/queryParams/filter";
import parseSort from "@utils/queryParams/sort";

export const queryParser = {
  parse: function (queryParam: QueryParam): QueryString {
    if (queryParam === undefined) {
      return {};
    }

    if (queryParam.filter?.filters) {
      queryParam.filter.filters = queryParam.filter?.filters?.filter(
        (x) => x.value !== ""
      );
    }

    const queryString = {
      page: queryParam.page,
      before: queryParam.before,
      after: queryParam.after,
      pageSize: queryParam?.perPage,
      sort: parseSort(queryParam.sort ?? defaultParams.sort),
    } as QueryString;

    if (queryParam?.filter) {
      const filter = parseFilter(queryParam?.filter);
      queryString.filter = filter;
    }
    return queryString;
  },
};
