import { defaultParams, Params } from "@/src/types/Params";
import IQueryParam from "@/src/types/IQueryParam";
import parseFilter from "./filter";
import parseSort from "./sort";

const filterParser = {
  parse: function (query: Params): IQueryParam {
    const params = {
      page: query.page,
      before: query.pre,
      after: query.next,
      pageSize: query?.perPage,
      sort: parseSort(
        query?.sort?.length > 0 ? query?.sort : defaultParams.sort
      ),
    } as IQueryParam;

    if (query?.filter) {
      params.filter = parseFilter(query?.filter);
    }
    return params;
  },
};

export default filterParser;
