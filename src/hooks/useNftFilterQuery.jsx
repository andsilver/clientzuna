import { useMemo } from "react";

import useQuery from "./useQuery";

export default function useNftFilterQuery() {
  const query = useQuery();

  return useMemo(() => {
    return {
      search: query.get("search") || "",
      category: query.get("category") || "",
      saleType: query.get("saleType") || "",
      collectionId: query.get("collectionId") || "",
      currency: query.get("currency") || "",
      order: query.get("order") || "",
      orderBy: query.get("orderBy") || "",
      properties: query.get("properties") || "",
    };
  }, [query]);
}
