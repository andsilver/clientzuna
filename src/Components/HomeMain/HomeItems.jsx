import { Container, Grid, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { getHomeData } from "../../api/api";
import CollectionCard from "../Collections/CollectionCard";
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
    items: 3,
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 1,
  },
};

const Title = styled(({ ...props }) => (
  <Typography
    {...props}
    mb={2}
    mt={4}
    variant="h5"
    color="primary"
    lineHeight={1}
  />
))((t) => ({
  borderLeft: `4px solid ${t.theme.palette.secondary.main}`,
  paddingLeft: 8,
  fontWeight: "bold",
}));

export default function HomeItems() {
  const [data, setData] = useState();

  const fetchHomeData = async () => {
    const homeData = await getHomeData();
    setData(homeData);
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  return (
    <Container maxWidth="xl">
      <Title>Featured Users</Title>
      <Carousel responsive={responsive}>
        {(data?.featuredUsers || []).map((u) => (
          <ProfileCard key={u.id} user={u} />
        ))}
      </Carousel>
      <Title>Collections</Title>
      <Carousel responsive={responsive}>
        {(data?.collections || []).map((u) => (
          <CollectionCard key={u.id} collection={u} />
        ))}
      </Carousel>
      <Title>Top Sellers</Title>
      <Grid mb={7} container spacing={2}>
        {(data?.sellers || []).map((s) => (
          <Grid item xs={6} md={3} lg={2} key={s.id}>
            <UserLink user={s} />
          </Grid>
        ))}
      </Grid>
      <Title>Top Buyers</Title>
      <Grid mb={8} container spacing={2}>
        {(data?.buyers || []).map((s) => (
          <Grid item xs={6} md={3} lg={2} key={s.id}>
            <UserLink user={s} />
          </Grid>
        ))}
      </Grid>
      <Title>Get Started Creating & Selling Your NFTs</Title>
      <HomeItemsInfo />
    </Container>
  );
}
