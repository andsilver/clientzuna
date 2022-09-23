import { Button, Grid } from "@mui/material";
import { memo } from "react";

export default memo(
  ({ allLoaded, loading, loadMore }) =>
    !allLoaded &&
    !loading && (
      <Grid container justifyContent="center" mt={4}>
        <Button
          color="primary"
          variant="outlined"
          onClick={loadMore}
          sx={{ minWidth: 160, height: 48 }}
          disabled={loading}
        >
          Load More
        </Button>
      </Grid>
    )
);
