import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

interface PaginatedRepoResponse {
  readonly data: DbRepo[];
  readonly meta: Meta;
}

const useRepositoriesList = (skipFilters = false) => {
  const router = useRouter();
  const { filterName, selectedFilter } = router.query;
  const topic = filterName as string;
  const filter = selectedFilter as string;  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const baseEndpoint = !skipFilters ? `${topic}/repos` : "repos/list";
  const pageQuery = page ? `page=${page}` : "";
  const filterQuery = filter ? `&filter=${filter}` : "";
  const limitQuery = limit ? `&limit=${limit}` : "";
  const endpointString = `${baseEndpoint}?${pageQuery}${limitQuery}${!skipFilters ? filterQuery : ""}`;
  const { data, error, mutate } = useSWR<PaginatedRepoResponse, Error>(topic ? endpointString : null);


  return {
    data: data?.data ?? [],
    meta: data?.meta ?? { itemCount: 0, limit: 0, page: 0, hasNextPage: false, hasPreviousPage: false, pageCount: 0 },
    isLoading: !error && !data,
    isError: !!error,
    mutate,
    page,
    setPage,
    setLimit
  };
};

export { useRepositoriesList };