import { Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { filterNfts } from "../api/api";
import NftList from "../Components/common/NftList";
import ExplorerFilter from "../Components/Explorer/Filter";
import { config } from "../config";
import useQuery from "../hooks/useQuery";

export default function Explorer() {
  const [nfts, setNfts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const query = useQuery();
  const [allLoaded, setAllLoaded] = useState(false);

  const fetchNFTs = async (init = false) => {
    setLoading(true);

    try {
      const { result, count } = await filterNfts({
        search: query.get("search") || "",
        category: query.get("category") || "",
        saleType: query.get("saleType") || "",
        collectionId: query.get("collectionId") || "",
        offset: init ? 0 : nfts.length,
      });
      setAllLoaded(result.length < config.defaultPageSize);
      setNfts(init ? result : [...nfts, ...result]);
      setCount(count);
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
        count={count}
      />
    </Container>
  );
}
