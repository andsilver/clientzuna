import { Grid } from "@mui/material";

import NoData from "../NoData";
import SectionLoading from "../SectionLoading";
import LoadMore from "./LoadMore";
import NftCard from "./NftCard";

export default function NftList({
  nfts,
  allLoaded = true,
  loadMore = () => {},
  maxCount = 3,
  loading,
}) {
  return (
    <div style={{ marginTop: 24 }}>
      {!!nfts.length && (
        <div>
          <Grid container spacing={1}>
            {nfts.map((nft) => (
              <Grid item key={nft.id} xs={12} sm={6} md={4} lg={12 / maxCount}>
                <NftCard nft={nft} />
              </Grid>
            ))}
          </Grid>
          <LoadMore
            loading={loading}
            allLoaded={allLoaded}
            loadMore={loadMore}
          />
        </div>
      )}
      {loading ? <SectionLoading /> : !nfts.length && <NoData />}
    </div>
  );
}
