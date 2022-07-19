import { Grid, Typography } from "@mui/material";
import { memo } from "react";

import Link from "./Link";

export default memo(({ collection, size = 44 }) => {
  return collection ? (
    <Link to={`/collections/${collection.id}`}>
      <Grid container alignItems="center">
        <img
          src={collection.image}
          alt="img"
          width={size}
          height={size}
          style={{ borderRadius: "50%" }}
        />
        <Grid item>
          <Typography ml={1} color="primary" fontWeight={600}>
            {collection.name}
          </Typography>
        </Grid>
      </Grid>
    </Link>
  ) : (
    <></>
  );
});
