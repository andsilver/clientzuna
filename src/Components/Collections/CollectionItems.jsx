import { useEffect, useState } from "react";
import { filterNfts } from "../../api/api";
import useLoading from "../../hooks/useLoading";
import useQuery from "../../hooks/useQuery";
import NftList from "../common/NftList";

export default function CollectionItems({ collection }) {
  const { loading, sendRequest } = useLoading();
  const [items, setItems] = useState([]);
  const [allLoaded, setAllLoaded] = useState(false);
  const query = useQuery();

  const fetchItems = async (init) => {
    const filter = {
      collectionId: collection.id,
      category: query.get("category") || "",
      search: query.get("search") || "",
      saleType: query.get("saleType") || "",
    };
    const res = await sendRequest(() => filterNfts(filter));

    if (res) {
      setItems(init ? res : [...items, ...res]);
      setAllLoaded(res.length < 20);
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
    />
  );
}
