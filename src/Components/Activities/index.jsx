import { Grid } from "@mui/material";
import { memo } from "react";
import SectionLoading from "../SectionLoading";
import Activity from "./Activity";

export default memo(({ activities, loadMore, loading, allLoaded }) => {
  const scroll = (e) => {
    if (loading || allLoaded) {
      return;
    }

    if (
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <
      1
    ) {
      loadMore && loadMore();
    }
  };

  return (
    <Grid
      container
      flexDirection={"column"}
      flexWrap="nowrap"
      spacing={2}
      maxHeight={400}
      overflow="auto"
      onScroll={scroll}
    >
      {activities.map((activity) => (
        <Grid item key={activity.id}>
          <Activity activity={activity} />
        </Grid>
      ))}
      <Grid item>
        <SectionLoading spacing={1} />
      </Grid>
    </Grid>
  );
});
