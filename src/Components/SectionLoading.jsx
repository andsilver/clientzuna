import { CircularProgress, Grid } from "@mui/material";
import { memo } from "react";

export default memo(({ color = "primary" }) => (
  <Grid container justifyContent="center" py={4}>
    <CircularProgress color={color} size={24} />
  </Grid>
));
