import { Button, Grid } from "@mui/material";
import { memo } from "react";

export default memo(
  ({ allLoaded, loading, loadMore }) =>
    !allLoaded &&
    !loading && (
      <Grid container justifyContent="center" mt={2}>
        <Button
          color="secondary"
          variant="contained"
          onClick={loadMore}
          sx={{ minWidth: 200 }}
          disabled={loading}
        >
          Load More
        </Button>
      </Grid>
    )
);
