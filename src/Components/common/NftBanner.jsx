import { styled, Grid } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";

const END_DATE = "2023/01/13";

const BannerContainer = styled("div")((t) => ({
  padding: "8px 16px",
  borderRadius: "10px",
  fontWeight: 600,
  fontSize: 15,
  backgroundColor: t.theme.palette.background.paper,
  opacity: 0.7,
}));

export default function NftBanner({ detail }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timeout = setInterval(() => {
      function secondsToString(seconds) {
        const numdays = Math.floor((seconds % 31536000) / 86400);
        const numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
        const numminutes = Math.floor(
          (((seconds % 31536000) % 86400) % 3600) / 60
        );
        const numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;

        if (numdays === 0 && numhours === 0) {
          return numhours + "h : " + numminutes + "m : " + numseconds + "s";
        }
        return numdays + "d : " + numhours + "h : " + numminutes + "m";
      }
      const seconds = Math.floor(
        moment(new Date(END_DATE)).diff(moment()) / 1000
      );
      setTimeLeft(secondsToString(seconds));
    }, 1000);

    return () => clearInterval(timeout);
  }, []);

  return detail ? (
    timeLeft
  ) : (
    <Grid
      container
      justifyContent="center"
      style={{ position: "absolute", bottom: 16 }}
    >
      <BannerContainer>{"Closing in " + timeLeft}</BannerContainer>
    </Grid>
  );
}
