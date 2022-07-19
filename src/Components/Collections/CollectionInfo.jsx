import { Box, Button, Grid, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { memo } from "react";
import { config } from "../../config";

import UserLink from "../UserLink";

const CollectionImage = styled("div")((t) => ({
  border: `3px solid ${t.theme.palette.mode === "light" ? "#eee" : "#27273a"}`,
  borderRadius: 14,
  width: 200,
  height: 200,
  marginTop: -160,
  overflow: "hidden",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  [t.theme.breakpoints.down("sm")]: {
    width: 120,
    height: 120,
    marginTop: -80,
  },
}));

const CollectionInfoBox = styled(Box)((t) => ({
  border: `2px solid ${t.theme.palette.mode === "light" ? "#eee" : "#27273a"}`,
  borderRadius: 14,
}));

export default memo(({ collection, onEdit, isOwner }) => {
  return (
    <div>
      <Grid container justifyContent="space-between" alignItems="start">
        <CollectionImage
          style={{
            backgroundImage: `url(${collection.image})`,
          }}
        />
        {isOwner && (
          <Button
            style={{ marginTop: 12 }}
            variant="contained"
            color="secondary"
            onClick={onEdit}
          >
            Edit
          </Button>
        )}
      </Grid>
      <Grid
        container
        spacing={3}
        justifyContent="space-between"
        alignItems="end"
      >
        <Grid item xs={12} md={6}>
          <Typography mt={2} variant="h5" fontWeight="bold" color="primary">
            {collection.name}
          </Typography>
          <Grid container alignItems="center" mt={2}>
            <Typography color="gray" variant="subtitle2" mr={2}>
              Created by
            </Typography>
            <UserLink user={collection.owner} size={30} />
          </Grid>
          <Typography color="primary" variant="subtitle1" mt={2}>
            {collection.description}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <CollectionInfoBox mt={3} p={2}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography color="gray" fontWeight="600">
                  Floor
                </Typography>
              </Grid>
              <Grid item>
                <Typography color="primary" fontWeight="bold">
                  {collection.floorPrice} W{config.nativeCurrency}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Grid item>
                <Typography color="gray" fontWeight="600">
                  Volume
                </Typography>
              </Grid>
              <Grid item>
                <Typography color="primary" fontWeight="bold">
                  {collection.totalVolume} W{config.nativeCurrency}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Grid item>
                <Typography color="gray" fontWeight="600">
                  Owners
                </Typography>
              </Grid>
              <Grid item>
                <Typography color="primary" fontWeight="bold">
                  {collection.owners}
                </Typography>
              </Grid>
            </Grid>
          </CollectionInfoBox>
        </Grid>
      </Grid>
    </div>
  );
});
