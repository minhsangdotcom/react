import { defaultParams, Params } from "@/src/types/Params";
import IQueryParams from "@/src/types/IQueryParam";
import parseFilter from "./filter";
import parseSort from "./sort";

const filterParser = {
  parse: function (query: Params) : IQueryParams {
    const params = {
      page: query?.page ?? defaultParams.page,
      pageSize: query?.perPage ?? defaultParams.perPage,
      sort: parseSort(
        query?.sort?.length > 0 ? query?.sort : defaultParams.sort
      ),
    } as IQueryParams;

    if (query?.filter) {
      params.filter = parseFilter(query?.filter!);
    }
    return params;
  },
};

export default filterParser;
