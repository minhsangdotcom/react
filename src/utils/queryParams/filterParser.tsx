import { defaultParams, Params } from "@/types/Params";
import IQueryParam from "@/types/IQueryParam";
import parseFilter from "@utils/queryParams/filter";
import parseSort from "@utils/queryParams/sort";

const filterParser = {
  parse: function (query: Params): IQueryParam {
    if (query === undefined) {
      return {};
    }
    if (query.filter?.info) {
      query.filter.info = query.filter?.info?.filter((x) => x.value !== "");
    }
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
