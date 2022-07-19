import { useEffect, useState } from "react";
import { getLikedNfts } from "../../api/api";
import useLoading from "../../hooks/useLoading";
import NftList from "../common/NftList";

export default function NftsFavorited({ userAddress }) {
  const [nfts, setNfts] = useState([]);
  const { loading, sendRequest } = useLoading();

  const fetchNfts = async (init) => {
    const res = await sendRequest(() =>
      getLikedNfts(userAddress, init ? 0 : nfts.length)
    );
    setNfts(init ? res : [...nfts, ...res]);
  };

  useEffect(() => {
    fetchNfts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <NftList nfts={nfts} loading={loading} />;
}
