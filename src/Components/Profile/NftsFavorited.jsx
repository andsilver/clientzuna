import { useEffect, useState } from "react";
import { getLikedNfts } from "../../api/api";
import { config } from "../../config";
import useLoading from "../../hooks/useLoading";
import NftList from "../common/NftList";

export default function NftsFavorited({ userAddress }) {
  const [nfts, setNfts] = useState([]);
  const { loading, sendRequest } = useLoading();
  const [allLoaded, setAllLoaded] = useState(false);

  const fetchNfts = async (init) => {
    const res = await sendRequest(() =>
      getLikedNfts(userAddress, init ? 0 : nfts.length)
    );
    if (res) {
      setNfts(init ? res : [...nfts, ...res]);
      setAllLoaded(res.length < config.defaultPageSize);
    }
  };

  useEffect(() => {
    fetchNfts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NftList
      nfts={nfts}
      loading={loading}
      allLoaded={allLoaded}
      loadMore={() => fetchNfts(false)}
    />
  );
}
