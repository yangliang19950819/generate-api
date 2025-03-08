import {
  DefaultError,
  QueryKey,
  UseMutationOptions,
  UseMutationResult,
  UseQueryResult,
  UseQueryOptions,
  useQuery as useReactQuery,
} from "@tanstack/react-query";

export type UseMutationParameters<
  data = unknown,
  error = Error,
  variables = void,
  context = unknown,
> = Omit<
  UseMutationOptions<data, error, variables, context>,
  "mutationFn" | "mutationKey" | "throwError"
>;

export type UseQueryParams<
  queryFnData = unknown,
  error = DefaultError,
  data = queryFnData,
  queryKey extends QueryKey = QueryKey,
> = Partial<
  Omit<UseQueryOptions<queryFnData, error, data, queryKey>, "initialData">
> & {
  initialData?:
    | UseQueryOptions<queryFnData, error, data, queryKey>["initialData"]
    | undefined;
};

/** 通用分页对象字段 */
export interface Page {
  begin: number;
  end: number;
  length: number;
  pageCount: number;
  pageNo: number;
  totalRecords: number;
}

/** 通用分页查询参数 */
export interface ParamsWithFilter<Condition = Record<string, unknown>> {
  condition?: Condition;
  page?: Pick<Page, "pageNo" | "length">;
}

/** 后端接口返回的分页数据格式 */
export interface DataWithPage<Data = unknown> {
  result?: Data[];
  page: Page;
}

export type UseQueryReturnType<
  data = unknown,
  error = DefaultError,
> = UseQueryResult<data, error> & {
  queryKey: QueryKey;
};

export const useQuery = <queryFnData, error, data, queryKey extends QueryKey>(
  parameters: UseQueryParams<queryFnData, error, data, queryKey> & {
    queryKey: QueryKey;
  }
) => {
  const result = useReactQuery(parameters);
  return {
    ...result,
    queryKey: parameters.queryKey,
  };
};

export interface QueryParam<
  queryFnData = unknown,
  error = DefaultError,
  data = queryFnData,
  queryKey extends QueryKey = QueryKey,
> {
  query?:
    | Omit<
        UseQueryParams<queryFnData, error, data, queryKey>,
        "queryFn" | "queryHash" | "queryKey" | "queryKeyHashFn" | "throwOnError"
      >
    | undefined;
}
