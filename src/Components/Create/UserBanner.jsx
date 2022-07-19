import { Box } from "@mui/material";
import { styled } from "@mui/system";
import { memo } from "react";
import DummyImage from "../../assets/dummy-image.jpg";

const UserBannerContainer = styled(Box)(({ theme }) => ({
  height: 300,
  [theme.breakpoints.down("md")]: {
    height: 200,
  },
}));

export default memo(({ user }) => (
  <UserBannerContainer
    style={{
      background: `url(${
        user?.banner || DummyImage
      }) center center / cover no-repeat`,
    }}
  />
));
