import { Grid, Typography } from "@mui/material";

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
  count,
}) {
  return (
    <div>
      <Grid container justifyContent="flex-end" my={2}>
        <Grid item mr={1}>
          <Typography variant="h6" color="primary">
            {count || 0} items
          </Typography>
        </Grid>
      </Grid>
      {!!nfts.length && (
        <div>
          <Grid container spacing={2}>
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
