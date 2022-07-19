import { Typography } from "@mui/material";
import { styled } from "@mui/system";
import { memo } from "react";

const NoDataContainer = styled("div")((t) => ({
  borderRadius: 10,
  textAlign: "center",
  padding: "36px 0",
  background:
    t.theme.palette.mode === "light"
      ? "#f3f3f3"
      : t.theme.palette.background.paper,
}));

export default memo(({ text }) => (
  <NoDataContainer>
    <Typography color="primary">{text || "No data found"}</Typography>
  </NoDataContainer>
));
