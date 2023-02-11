import { Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";

import { filterNfts } from "../api/api";
import NftList from "../Components/common/NftList";
import TopBanner from "../Components/common/TopBanner";
import ExplorerFilter from "../Components/Explorer/Filter";
import { config } from "../config";
import useNftFilterQuery from "../hooks/useNftFilterQuery";

export default function Explorer() {
  const [nfts, setNfts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const query = useNftFilterQuery();
  const [allLoaded, setAllLoaded] = useState(false);

  const fetchNFTs = async (init = false) => {
    setLoading(true);

    try {
      const { result, count } = await filterNfts({
        ...query,
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
    <div style={{ marginTop: -80 }}>
      <TopBanner>
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          color="white"
        >
          Explore Exclusive Digital Assets
        </Typography>
      </TopBanner>
      <Container maxWidth="xl" sx={{ pb: 4, pt: 3 }}>
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
    </div>
  );
}
