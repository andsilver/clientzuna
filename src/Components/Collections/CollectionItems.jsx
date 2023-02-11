import { useEffect, useState } from "react";
import { filterNfts } from "../../api/api";
import { config } from "../../config";
import useLoading from "../../hooks/useLoading";
import useNftFilterQuery from "../../hooks/useNftFilterQuery";
import NftList from "../common/NftList";

export default function CollectionItems({ collection }) {
  const { loading, sendRequest } = useLoading();
  const [items, setItems] = useState([]);
  const [allLoaded, setAllLoaded] = useState(false);
  const query = useNftFilterQuery();
  const [count, setCount] = useState(0);

  const fetchItems = async (init) => {
    const { result, count } = await sendRequest(() =>
      filterNfts({
        ...query,
        collectionId: collection.id,
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
