import { useEffect, useState } from "react";

import { getUserOtherNfts } from "../../api/api";
import useLoading from "../../hooks/useLoading";
import NftList from "../common/NftList";

export default function NftsCollected({ userAddress }) {
  const [nfts, setNfts] = useState([]);
  const { loading, sendRequest } = useLoading();
  const [cursor, setCursor] = useState("");
  const [count, setCount] = useState(0);

  const fetchNfts = async (init) => {
    const {
      total,
      result,
      cursor: currentCursor,
    } = await sendRequest(() => getUserOtherNfts(userAddress, cursor));

    if (result) {
      setNfts(init ? result : [...nfts, ...result]);
      setCursor(currentCursor);
      setCount(total);
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
      allLoaded={!cursor}
      loadMore={() => fetchNfts(false)}
      count={count}
    />
  );
}
