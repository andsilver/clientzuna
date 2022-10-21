import { Grid, Typography } from "@mui/material";
import { memo } from "react";

import Link from "./Link";

export default memo(
  ({
    collection,
    size = 44,
    background = false,
    rounded = true,
    extraText = "",
    fontSize = 16,
  }) => {
    return collection ? (
      <Link to={`/collections/${collection.id}`}>
        <Grid
          container
          alignItems="center"
          sx={
            background
              ? (t) => ({
                  p: 2,
                  borderRadius: 3,
                  background:
                    t.palette.mode === "dark"
                      ? t.palette.background.paper
                      : "#ececec",
                })
              : {}
          }
        >
          <img
            src={collection.image}
            alt="img"
            width={size}
            height={size}
            style={{ borderRadius: rounded ? "50%" : 10 }}
          />
          <Grid item>
            {extraText && (
              <Typography ml={2} color="primary" variant="subtitle2">
                {extraText}
              </Typography>
            )}
            <Typography
              ml={2}
              color="primary"
              fontWeight={600}
              fontSize={fontSize}
            >
              {collection.name}
            </Typography>
          </Grid>
        </Grid>
      </Link>
    ) : (
      <></>
    );
  }
);
