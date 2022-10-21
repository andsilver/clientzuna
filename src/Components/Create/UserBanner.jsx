import { Box } from "@mui/material";
import { styled } from "@mui/system";
import { memo } from "react";

import DarkImage from "../../assets/img_bg_page_title_dark.jpg";
import LightImage from "../../assets/img_bg_page_title_inner.jpg";

const UserBannerContainer = styled(Box)(({ theme }) => ({
  height: 300,
  [theme.breakpoints.down("md")]: {
    height: 240,
  },
}));

export default memo(({ user, children }) => (
  <UserBannerContainer
    sx={(t) => ({
      background: `url(${
        user?.banner || (t.palette.mode === "dark" ? DarkImage : LightImage)
      }) center center / cover no-repeat`,
    })}
  >
    {children}
  </UserBannerContainer>
));
