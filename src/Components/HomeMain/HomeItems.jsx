import { Box, Container, Grid, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";

import { getHomeData } from "../../api/api";
import useLoading from "../../hooks/useLoading";
import CollectionCard from "../Collections/CollectionCard";
import RainbowLink from "../common/RainbowLink";
import SectionLoading from "../SectionLoading";
import UserLink from "../UserLink";
import HomeItemsInfo from "./HomeItemsInfo";
import ProfileCard from "./ProfileCard";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 600 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 1,
  },
};

const Title = styled(({ ...props }) => (
  <Typography
    {...props}
    pb={4}
    pt={5}
    variant="h4"
    color="primary"
    lineHeight={1}
  />
))((t) => ({
  fontWeight: "bold",
}));

const SectionContainer = styled("div")(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  background: theme.palette.mode === "dark" ? "#1F1F2C" : "#f8f8f8",
}));

export default function HomeItems() {
  const [data, setData] = useState();
  const { loading, sendRequest } = useLoading();

  const fetchHomeData = async () => {
    const homeData = await sendRequest(() => getHomeData());

    if (homeData) {
      setData(homeData);
    }
  };

  useEffect(() => {
    fetchHomeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <SectionContainer>
        <Container maxWidth="xl">
          <Title>Featured Users</Title>
          {loading ? (
            <SectionLoading />
          ) : (
            <Carousel responsive={responsive}>
              {(data?.featuredUsers || []).map((u) => (
                <ProfileCard key={u.id} user={u} />
              ))}
            </Carousel>
          )}
        </Container>
      </SectionContainer>
      <Container maxWidth="xl" sx={{ mb: 6 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Title>Collections</Title>
          <RainbowLink link="/collections" text="EXPLORE MORE" />
        </Grid>
        {loading ? (
          <SectionLoading />
        ) : (
          <Carousel responsive={responsive}>
            {(data?.collections || []).map((u) => (
              <CollectionCard key={u.id} collection={u} />
            ))}
          </Carousel>
        )}
      </Container>
      <SectionContainer>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Title>Top Sellers</Title>
              {loading ? (
                <SectionLoading />
              ) : (
                <Grid mb={7} container spacing={2}>
                  {(data?.sellers || []).map((s) => (
                    <Grid item xs={12} sm={6} md={12} lg={6} key={s.id}>
                      <UserLink
                        rounded
                        swap
                        background
                        user={s}
                        size={64}
                        extraText={`$${s.amount}`}
                        fontSize={20}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Title>Top Buyers</Title>
              {loading ? (
                <SectionLoading />
              ) : (
                <Grid mb={8} container spacing={2}>
                  {(data?.buyers || []).map((s) => (
                    <Grid item xs={12} sm={6} md={12} lg={6} key={s.id}>
                      <UserLink
                        background
                        user={s}
                        size={64}
                        fontSize={20}
                        swap
                        rounded
                        extraText={`$${s.amount}`}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Container>
      </SectionContainer>
      <Container>
        <Box sx={{ pt: 3, pb: 6 }}>
          <HomeItemsInfo />
        </Box>
      </Container>
    </div>
  );
}
