import { Avatar, Grid, Tooltip, Typography } from "@mui/material";
import { memo } from "react";

export default memo(({ coin, price, usd, size = 20, align = "center" }) => {
  return (
    <Grid container alignItems={align}>
      <Grid item display="flex" alignItems="center">
        {!!coin && (
          <Tooltip title={coin.symbol}>
            <Avatar
              src={coin.image}
              sx={{ width: size, height: size, mr: 0.5 }}
            />
          </Tooltip>
        )}
        <Typography color="primary" fontSize={18} fontWeight={600}>
          {price || "-"}
        </Typography>
      </Grid>
      {!!price && (
        <Typography ml={1} color="primary" fontSize={12}>
          ${usd || 0}
        </Typography>
      )}
    </Grid>
  );
});
