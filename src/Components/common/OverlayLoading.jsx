import { Backdrop } from "@mui/material";
import LoadingSpinner from "../LoadingSpinner";

export default function OverlayLoading({ show }) {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1000,
      }}
      open={show}
    >
      <LoadingSpinner />
    </Backdrop>
  );
}
