import { Card, Grid, Typography } from "@mui/material";
import { useMemo, memo } from "react";
import {
  currencyAddressToSymbol,
  minimizeAddress,
  timeSince,
} from "../../helper/utils";
import Link from "../Link";
import DefaultUser from "../../assets/default_user.png";
import { config } from "../../config";

export default memo(({ activity }) => {
  const { image, link, name, timeStr, detail } = useMemo(() => {
    const timeStr = timeSince(+activity.createdAt);

    if (activity.nft) {
      return {
        image: activity.nft.image.replace("ipfs://", config.pinataGateWay),
        link: `/items/${activity.nft.id}`,
        name: activity.nft.name,
        timeStr,
        detail: activity.amount
          ? `${activity.amount} ${currencyAddressToSymbol(activity.currency)}`
          : "",
      };
    }
    if (activity.receiver) {
      return {
        image: activity.receiver.avatar || DefaultUser,
        link: `/users/${activity.receiver.pubKey}`,
        name:
          activity.receiver.name ||
          minimizeAddress(activity.receiver.pubKey, 4, -6),
        timeStr,
      };
    }

    return {};
  }, [activity]);

  return (
    <Card>
      <Grid container p={1}>
        <Link to={link || ""}>
          <div
            alt=""
            style={{
              borderRadius: 10,
              width: 100,
              height: 100,
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </Link>
        <Grid item ml={1}>
          <Typography color="primary" fontWeight="bold" gutterBottom>
            {name}
          </Typography>
          <Grid container alignItems="center">
            <Typography color="primary" variant="subtitle2" mr={1}>
              {activity.event} by
            </Typography>
            <Link to={`/users/${activity.user.pubKey}`}>
              <Typography color="primary" fontWeight="bold">
                {activity.user.name ||
                  minimizeAddress(activity.user.pubKey, 4, -6)}
              </Typography>
            </Link>
          </Grid>
          {detail && (
            <Typography variant="subtitle2" color="primary">
              {detail}
            </Typography>
          )}
          <Typography variant="subtitle2" color="primary" mt={1}>
            {timeStr}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
});
