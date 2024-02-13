import { useLocation } from "react-router-dom";

interface QueryParams {
  [key: string]: string | null;
}

const useQuery = (): QueryParams => {
  const query = new URLSearchParams(useLocation().search);
  const queryParams: QueryParams = {};

  query.forEach((value, key) => {
    queryParams[key] = value;
  });

  return queryParams;
};

export default useQuery;
