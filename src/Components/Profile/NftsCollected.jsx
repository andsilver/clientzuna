import { useEffect, useState } from "react";

import { filterNfts } from "../../api/api";
import useLoading from "../../hooks/useLoading";
import NftList from "../common/NftList";

export default function NftsCollected({ userAddress }) {
  const [nfts, setNfts] = useState([]);
  const { loading, sendRequest } = useLoading();

  const fetchNfts = async (init) => {
    const res = await sendRequest(() =>
      filterNfts({
        offset: init ? 0 : nfts.length,
        userAddress,
      })
    );

    if (res) {
      setNfts(init ? res : [...nfts, ...res]);
    }
  };

  useEffect(() => {
    fetchNfts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <NftList nfts={nfts} loading={loading} />;
}
