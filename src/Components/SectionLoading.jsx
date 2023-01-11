import { CircularProgress, Grid } from "@mui/material";
import { memo } from "react";

export default memo(({ color = "primary", spacing = 4 }) => (
  <Grid container justifyContent="center" py={spacing}>
    <CircularProgress color={color} size={24} />
  </Grid>
));
