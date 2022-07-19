import { Box, Card, Grid, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { memo } from "react";
import { minimizeAddress } from "../../helper/utils";
import Link from "../Link";
import DefaultUser from "../../assets/default_user.png";

const CollectionImageContainer = styled("div")((t) => ({
  border: `2px solid ${t.theme.palette.mode === "light" ? "#eee" : "#27273a"}`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  borderRadius: "50%",
  width: 80,
  height: 80,
  marginTop: -50,
  overflow: "hidden",
}));

export default memo(({ user }) => {
  return (
    <Card sx={{ p: 1, m: 1 }}>
      <Link to={`/users/${user.pubKey}`}>
        <Box
          sx={{
            backgroundImage: user.banner ? `url(${user.banner})` : "",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            borderRadius: 3,
            height: 120,
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? "rgba(22, 22, 26, 0.03)"
                : "rgba(255, 255, 255, 0.03)",
          }}
        />
        <Grid container alignItems="center" flexDirection="column">
          <CollectionImageContainer
            style={{ backgroundImage: `url(${user.avatar || DefaultUser})` }}
          />

          <Typography fontWeight="bold" mt={1}>
            {user.name || minimizeAddress(user.pubKey)}
          </Typography>
        </Grid>
      </Link>
    </Card>
  );
});
