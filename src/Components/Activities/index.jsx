import { Grid } from "@mui/material";
import { memo } from "react";
import Activity from "./Activity";

export default memo(({ activities }) => {
  return (
    <Grid
      container
      flexDirection={"column"}
      flexWrap="nowrap"
      spacing={2}
      maxHeight={400}
      overflow="auto"
    >
      {activities.map((activity) => (
        <Grid item key={activity.id}>
          <Activity activity={activity} />
        </Grid>
      ))}
    </Grid>
  );
});
