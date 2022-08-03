import { Grid, Typography } from "@mui/material";
import { memo } from "react";

import DefaultUserImg from "../assets/default_user.png";
import { minimizeAddress } from "../helper/utils";
import Link from "./Link";

export default memo(
  ({ user, extraText = null, showName = true, size = 44, rounded = true }) => {
    return user ? (
      <Link to={`/users/${user.pubKey}`}>
        <Grid container alignItems="center">
          <img
            src={user.thumbnail || user.avatar || DefaultUserImg}
            alt="img"
            width={size}
            height={size}
            style={{ borderRadius: rounded ? "50%" : 10 }}
          />
          <Grid item>
            {extraText && (
              <Typography ml={1} color="primary" variant="subtitle2">
                {extraText}
              </Typography>
            )}
            {showName && (
              <Typography ml={1} color="primary" fontWeight={600}>
                {user.name || minimizeAddress(user.pubKey, 7, -4)}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Link>
    ) : (
      <></>
    );
  }
);
