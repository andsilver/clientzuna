import { Box } from "@mui/material";
import { styled } from "@mui/system";
import DummyImage from "../../assets/dummy-image.jpg";

const BannerContainer = styled(Box)(({ theme }) => ({
  height: 440,
  [theme.breakpoints.down("md")]: {
    height: 300,
  },
}));

export default function PageBanner({ image }) {
  return (
    <BannerContainer
      style={{
        background: `url(${
          image || DummyImage
        }) center center / cover no-repeat`,
      }}
    />
  );
}
