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
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper";

import Link from "../Link";

const swipers = [
  [
    "https://res.cloudinary.com/zunaverse-media/image/upload/v1659581516/sh6ddurga3is97hxjvvw.jpg",
    "https://res.cloudinary.com/zunaverse-media/image/upload/v1659581539/ibsg0oljruj2bndyptxx.jpg",
    "https://res.cloudinary.com/zunaverse-media/image/upload/v1659581522/wft0606jjcz81ks0yt59.jpg",
    "https://res.cloudinary.com/zunaverse-media/image/upload/v1659581541/iyhp2sw1za8nhdn1sf3l.jpg",
    "https://res.cloudinary.com/zunaverse-media/image/upload/v1659581556/odsadncxirmypeybkkl3.jpg",
    "https://res.cloudinary.com/zunaverse-media/image/upload/v1659581544/dyl61u7kxycubroqqvgp.jpg",
  ],
  [
    "https://res.cloudinary.com/zunaverse-media/image/upload/v1659581551/uvwmgjdycugasvpccyyd.jpg",
    "https://res.cloudinary.com/zunaverse-media/image/upload/v1659581553/u8uwopef2janjxbmpaab.jpg",
    "https://res.cloudinary.com/zunaverse-media/image/upload/v1659592637/nfts/umsamsfeas1zi8usazjd.jpg",
    "https://res.cloudinary.com/zunaverse-media/image/upload/v1659581558/c3omwhjlurpoa959e9ln.jpg",
    "https://res.cloudinary.com/zunaverse-media/image/upload/v1659581560/vw5601wm3sezfqkpzpsa.jpg",
    "https://res.cloudinary.com/zunaverse-media/image/upload/v1659581563/vvdznfrp5un8rixmfhns.jpg",
  ],
  [
    "https://res.cloudinary.com/zunaverse-media/image/upload/v1659592888/nfts/eyknuwva0avvcevpqj0c.jpg",
    "https://res.cloudinary.com/zunaverse-media/image/upload/v1659581581/qrl79opw4alpimpfpevj.jpg",
    "https://res.cloudinary.com/zunaverse-media/image/upload/v1659581588/lisa7oyfttx1eeaiq5ua.jpg",
    "https://res.cloudinary.com/zunaverse-media/image/upload/v1659581586/jhnylzjtvaigtlfqw03b.jpg",
    "https://res.cloudinary.com/zunaverse-media/image/upload/v1659581579/pzufjuojuviefjdlk74x.jpg",
    "https://res.cloudinary.com/zunaverse-media/image/upload/v1659581590/aiqvswur28xnxkbqnd6u.jpg",
  ],
];

const HomeMain = styled(Grid)({
  minHeight: "100vh",
  position: "relative",
});

const HomeButton = styled(Button)({
  padding: "12px 38px",
  fontSize: 18,
  marginRight: 12,
  border: "2px solid white",
  "&:hover": {
    color: "#5142FC",
    background: "white",
    border: "2px solid white",
  },
});

const LandingDesign = () => {
  const {
    palette: { mode },
  } = useTheme();
  const md = useMediaQuery((t) => t.breakpoints.down("md"));
  const upLg = useMediaQuery((t) => t.breakpoints.up("md"));

  return (
    <Box
      py={4}
      style={{
        background:
          mode === "dark"
            ? "transparent"
            : "linear-gradient(227.3deg, #8A208C 0%, #181B81 100.84%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="xl">
        <HomeMain
          container
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
        >
          <Grid item xs={12} md={6} zIndex={1}>
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
        </HomeMain>
        {upLg && (
          <div
            style={{
              position: "absolute",
              width: 1500,
              top: 40,
              right: -240,
              transform: "rotate(55deg)",
              zIndex: 0,
            }}
          >
            {swipers.map((swiper, index) => (
              <div key={index} style={{ paddingTop: 10 }}>
                <Swiper
                  className="landing-swiper"
                  loop
                  autoplay={{
                    enabled: true,
                    delay: 1,
                    disableOnInteraction: false,
                  }}
                  modules={[Autoplay, FreeMode]}
                  speed={1500 + 300 * index}
                  slidesPerView={6}
                  spaceBetween={20}
                >
                  {swiper.map((image) => (
                    <SwiperSlide key={image}>
                      <div>
                        <img
                          src={image}
                          height={230}
                          alt=""
                          style={{
                            borderRadius: 12,
                            transform: "rotate(-90deg)",
                          }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ))}
          </div>
        )}
      </Container>
    </Box>
  );
};

export default LandingDesign;
