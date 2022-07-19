import { Backdrop, Grid, Typography } from "@mui/material";
import { config } from "../../config";
import LoadingSpinner from "../LoadingSpinner";

export default function WrongNetwork({ show = false }) {
  return show ? (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open
    >
      <Grid>
        <LoadingSpinner />
        <Typography textAlign="center" mt={3} fontWeight="bold" variant="h6">
          Wrong Network
        </Typography>
        <Typography textAlign="center" mt={3} fontWeight="bold" variant="h6">
          Please change your network to {config.networkName}
        </Typography>
      </Grid>
    </Backdrop>
  ) : (
    <></>
  );
}
