import { useEffect, useState } from "react";
import { filterNfts } from "../../api/api";
import { config } from "../../config";
import useLoading from "../../hooks/useLoading";
import useNftFilterQuery from "../../hooks/useNftFilterQuery";
import NftList from "../common/NftList";
import ExplorerFilter from "../Explorer/Filter";

export default function NftsCreated({ userAddress }) {
  const [nfts, setNfts] = useState([]);
  const { loading, sendRequest } = useLoading();
  const [allLoaded, setAllLoaded] = useState(false);
  const [count, setCount] = useState(0);
  const query = useNftFilterQuery();

  const fetchNfts = async (init) => {
    const { result, count } = await sendRequest(() =>
      filterNfts({
        ...query,
        offset: init ? 0 : nfts.length,
        creatorAddress: userAddress,
      })
    );

    if (!result) {
      return;
    }
    setNfts(init ? result : [...nfts, ...result]);
    setAllLoaded(result.length < config.defaultPageSize);
    setCount(count);
  };

  useEffect(() => {
    fetchNfts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <>
      <ExplorerFilter />
      <NftList
        nfts={nfts}
        loading={loading}
        allLoaded={allLoaded}
        loadMore={() => fetchNfts(false)}
        count={count}
      />
    </>
  );
}
