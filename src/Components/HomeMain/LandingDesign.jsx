import ImageBanner from ".//img-banner.png";
import { styled } from "@mui/system";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Link from "../Link";

const HomeMain = styled(Grid)({
  minHeight: "100vh",
  position: "relative",
});

const HomeButton = styled(Button)({
  padding: "12px 35px",
  fontSize: 15,
  marginRight: 12,
  "&:hover": {
    color: "#5142FC",
    background: "white",
  },
});

const LandingDesign = () => {
  const {
    palette: { mode },
  } = useTheme();
  const matches = useMediaQuery("(max-width:1199px)");
  const md = useMediaQuery((t) => t.breakpoints.down("md"));

  return (
    <Box
      py={4}
      style={{
        background:
          mode === "dark"
            ? "transparent"
            : "linear-gradient(227.3deg, #8A208C 0%, #181B81 100.84%)",
      }}
    >
      <Container maxWidth="xl">
        <HomeMain
          container
          justifyContent="space-between"
          alignItems="center"
          pt={matches ? 12 : 2}
          spacing={3}
        >
          <Grid item xs={12} md={6}>
            <Typography
              variant={md ? "h4" : "h2"}
              fontWeight="bold"
              color="white"
            >
              Discover, Collect &amp; Sell
            </Typography>
            <Typography
              variant={md ? "h4" : "h2"}
              fontWeight="bold"
              color="white"
            >
              {mode === "light" ? (
                <span
                  style={{
                    WebkitTextStrokeColor: "#fff",
                    WebkitTextStrokeWidth: "1px",
                    WebkitTextFillColor: "rgba(0,0,0,0)",
                  }}
                >
                  Out of This World
                </span>
              ) : (
                <span
                  style={{
                    background:
                      "linear-gradient(-45deg, #E250E5, #4B50E6, #E250E5, #4B50E6)",
                    backgroundSize: "100% 100%",
                    WebkitTextStroke: "3px transparent",
                    WebkitTextFillColor: "currentColor",
                    WebkitBackgroundClip: "text",
                    color: "#14141f",
                  }}
                >
                  Out of This World
                </span>
              )}
              <span> &nbsp;NFT's</span>
            </Typography>
            <Typography mt={2} variant="h6" color="white">
              Built on Binance Smart Chain for fast transactions and lower fees.
            </Typography>
            <Box mt={3}>
              <Link to="/explorer">
                <HomeButton
                  startIcon={
                    <i className="fa fa-rocket" style={{ fontSize: 14 }} />
                  }
                  variant="outlined"
                  color="bright"
                >
                  Explore
                </HomeButton>
              </Link>
              <Link to="/create">
                <HomeButton
                  startIcon={
                    <i className="fa fa-sticky-note" style={{ fontSize: 14 }} />
                  }
                  variant="outlined"
                  color="bright"
                >
                  Create
                </HomeButton>
              </Link>
            </Box>
          </Grid>
          <Grid item textAlign="center">
            <img style={{ maxWidth: "100%" }} src={ImageBanner} alt="" />
          </Grid>
        </HomeMain>
      </Container>
    </Box>
  );
};

export default LandingDesign;
