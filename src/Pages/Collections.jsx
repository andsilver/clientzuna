import { Grid, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { filterCollections } from "../api/api";
import CollectionCard from "../Components/Collections/CollectionCard";
import LoadMore from "../Components/common/LoadMore";
import TopBanner from "../Components/common/TopBanner";
import NoData from "../Components/NoData";
import SectionLoading from "../Components/SectionLoading";
import { config } from "../config";
import useLoading from "../hooks/useLoading";

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const { loading, sendRequest } = useLoading();
  const [allLoaded, setAllLoaded] = useState(false);

  const fetchCollections = async (init) => {
    try {
      const res = await sendRequest(() =>
        filterCollections({ offset: init ? 0 : collections.length })
      );
      setAllLoaded(res.length < config.defaultPageSize);
      setCollections(init ? res : [...collections, ...res]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCollections(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ marginTop: -80 }}>
      <TopBanner>
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          color="white"
        >
          Explore Collections
        </Typography>
      </TopBanner>
      <Container maxWidth="xl" sx={{ pb: 4, pt: 3 }}>
        {!!collections.length && (
          <div>
            <Grid container spacing={2}>
              {collections.map((c) => (
                <Grid item key={c.id} xs={12} sm={6} md={4} lg={3}>
                  <CollectionCard collection={c} />
                </Grid>
              ))}
            </Grid>
            <LoadMore
              loading={loading}
              allLoaded={allLoaded}
              loadMore={fetchCollections}
            />
          </div>
        )}
        {loading ? <SectionLoading /> : !collections.length && <NoData />}
      </Container>
    </div>
  );
}
