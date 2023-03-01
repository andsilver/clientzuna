import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { filterActivities } from "../../api/api";
import useLoading from "../../hooks/useLoading";
import useQuery from "../../hooks/useQuery";
import NoData from "../NoData";
import SectionLoading from "../SectionLoading";
import ActivityCard from "./ActivityCard";
import ActivityFilter from "./ActivityFilter";

export default function UserActivities({ userAddress, size = 12 }) {
  const [activities, setActivities] = useState([]);
  const [allLoaded, setAllLoaded] = useState(false);
  const { loading, sendRequest } = useLoading();
  const query = useQuery();

  const fetchActivities = async (init) => {
    const categories = query.get("categories")?.split(",") || [];
    const res = await sendRequest(() =>
      filterActivities({
        categories,
        address: userAddress,
        offset: init ? 0 : activities.length,
      })
    );

    if (res) {
      setAllLoaded(res.length < 20);
      setActivities(init ? res : [...activities, ...res]);
    }
  };

  useEffect(() => {
    if (!userAddress) {
      return;
    }
    fetchActivities(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress, query]);

  return (
    <Grid container spacing={3}>
      <Grid
        item
        xs={12}
        md={8}
        sx={(t) => ({ [t.breakpoints.down("md")]: { order: 2 } })}
      >
        {activities.length ? (
          <Grid container spacing={2}>
            {activities.map((activity) => (
              <Grid item xs={12} md={size} key={activity.id}>
                <ActivityCard activity={activity} />
              </Grid>
            ))}
          </Grid>
        ) : (
          !loading && <NoData />
        )}
        {!allLoaded && !loading && (
          <Grid container justifyContent="center" mt={2}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => fetchActivities()}
              sx={{ minWidth: 200 }}
            >
              Load More
            </Button>
          </Grid>
        )}
        {loading && <SectionLoading />}
      </Grid>
      <Grid
        item
        xs={12}
        md={4}
        sx={(t) => ({ [t.breakpoints.down("md")]: { order: 1 } })}
      >
        <ActivityFilter />
        <div></div>
      </Grid>
    </Grid>
  );
}
