import { styled } from "@mui/material";
import DarkImage from "../../assets/img_bg_page_title_dark.jpg";
import LightImage from "../../assets/img_bg_page_title_inner.jpg";

const Container = styled("div")((t) => ({
  backgroundImage: `url(${
    t.theme.palette.mode === "dark" ? DarkImage : LightImage
  })`,
  padding: "180px 0 70px",
  position: "relative",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundSize: "cover",
}));

const Overlay = styled("div")((t) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgb(52 52 68/30%)",
  zIndex: 0,
}));

export default function TopBanner({ children }) {
  return (
    <Container>
      <Overlay />
      <div style={{ zIndex: 2, position: "relative" }}>{children}</div>
    </Container>
  );
}
