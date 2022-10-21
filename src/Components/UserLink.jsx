import { Grid, Typography } from "@mui/material";
import { memo } from "react";

import DefaultUserImg from "../assets/default_user.png";
import { minimizeAddress } from "../helper/utils";
import Link from "./Link";

export default memo(
  ({
    user,
    extraText = null,
    showName = true,
    size = 44,
    rounded = false,
    background = false,
    fontSize = 16,
    swap = false,
  }) => {
    return user ? (
      <Link to={`/users/${user.pubKey}`}>
        <Grid
          container
          alignItems="center"
          sx={
            background
              ? (t) => ({
                  background:
                    t.palette.mode === "dark"
                      ? t.palette.background.paper
                      : "#ececec",
                  p: 2,
                  borderRadius: 3,
                })
              : {}
          }
        >
          <img
            src={user.thumbnail || user.avatar || DefaultUserImg}
            alt="img"
            width={size}
            height={size}
            style={{ borderRadius: rounded ? "50%" : 10 }}
          />
          <Grid item display="flex" flexDirection="column">
            {extraText && (
              <Typography
                order={swap ? 2 : 1}
                ml={2}
                color="primary"
                variant="subtitle2"
              >
                {extraText}
              </Typography>
            )}
            {showName && (
              <Typography
                ml={2}
                order={swap ? 1 : 2}
                color="primary"
                fontWeight={600}
                fontSize={fontSize}
              >
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
