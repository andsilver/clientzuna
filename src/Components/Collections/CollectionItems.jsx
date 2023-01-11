import { useEffect, useState } from "react";
import { filterNfts } from "../../api/api";
import { config } from "../../config";
import useLoading from "../../hooks/useLoading";
import useQuery from "../../hooks/useQuery";
import NftList from "../common/NftList";

export default function CollectionItems({ collection }) {
  const { loading, sendRequest } = useLoading();
  const [items, setItems] = useState([]);
  const [allLoaded, setAllLoaded] = useState(false);
  const query = useQuery();
  const [count, setCount] = useState(0);

  const fetchItems = async (init) => {
    const filter = {
      collectionId: collection.id,
      category: query.get("category") || "",
      search: query.get("search") || "",
      saleType: query.get("saleType") || "",
      properties: query.get("properties") || "",
      currency: query.get("currency") || "",
    };
    const { result, count } = await sendRequest(() =>
      filterNfts({
        ...filter,
        offset: init ? 0 : items.length,
      })
    );

    if (result) {
      setItems(init ? result : [...items, ...result]);
      setAllLoaded(result.length < config.defaultPageSize);
      setCount(count);
    }
  };

  useEffect(() => {
    if (!collection) {
      return;
    }
    fetchItems(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection, query]);

  return (
    <NftList
      nfts={items}
      loading={loading}
      allLoaded={allLoaded}
      maxCount={4}
      loadMore={() => fetchItems()}
      count={count}
    />
  );
}
