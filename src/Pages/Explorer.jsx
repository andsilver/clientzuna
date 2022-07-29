import { Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { filterNfts } from "../api/api";
import NftList from "../Components/common/NftList";
import OverlayLoading from "../Components/common/OverlayLoading";
import ExplorerFilter from "../Components/Explorer/Filter";
import useQuery from "../hooks/useQuery";

export default function Explorer() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const query = useQuery();
  const [allLoaded, setAllLoaded] = useState(false);

  const fetchNFTs = async (init = false) => {
    setLoading(true);

    try {
      const res = await filterNfts({
        search: query.get("search") || "",
        category: query.get("category") || "",
        saleType: query.get("saleType") || "",
        collectionId: query.get("collectionId") || "",
        offset: init ? 0 : nfts.length,
      });
      setAllLoaded(res.length < 24);
      setNfts(init ? res : [...nfts, ...res]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchNFTs(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <Container maxWidth="xl" sx={{ pb: 4 }}>
      <OverlayLoading show={loading} />
      <Typography variant="h3" fontWeight="bold" color="primary" mb={3} mt={3}>
        Explore Exclusive Digital Assets
      </Typography>
      <ExplorerFilter />
      <NftList
        nfts={nfts}
        allLoaded={allLoaded}
        loading={loading}
        loadMore={() => fetchNFTs(false)}
        maxCount={4}
      />
    </Container>
  );
}
