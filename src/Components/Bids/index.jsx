import { Button, Grid, Typography } from "@mui/material";
import { memo } from "react";
import { sameAddress } from "../../helper/utils";
import Bid from "./Bid";

export default memo(({ nft, bids, currentUser, cancelBid, acceptBid }) => (
  <Grid
    container
    flexDirection={"column"}
    flexWrap="nowrap"
    spacing={2}
    maxHeight={400}
    overflow="auto"
  >
    {bids.length ? (
      bids.map((bid) => (
        <Grid
          item
          key={bid.id}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Bid bid={bid} />
          {sameAddress(bid.bidder.pubKey, currentUser?.pubKey || "") && (
            <Button variant="outlined" onClick={() => cancelBid(bid)}>
              Cancel
            </Button>
          )}
          {sameAddress(nft.owner.pubKey, currentUser?.pubKey || "") && (
            <Button variant="outlined" onClick={() => acceptBid(bid)}>
              Accept
            </Button>
          )}
        </Grid>
      ))
    ) : (
      <Typography color="GrayText" variant="subtitle2" ml={3} mt={2}>
        No bids
      </Typography>
    )}
  </Grid>
));
