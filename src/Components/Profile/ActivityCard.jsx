import { Card, Grid, Typography } from "@mui/material";
import { useMemo, memo } from "react";
import {
  currencyAddressToSymbol,
  minimizeAddress,
  timeSince,
} from "../../helper/utils";
import Link from "../Link";
import DefaultUser from "../../assets/default_user.png";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SendIcon from "@mui/icons-material/Send";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";

const IconsMapping = {
  Following: <PeopleAltIcon fontSize="large" />,
  Liked: <FavoriteIcon fontSize="large" />,
  "New Offer": <LocalOfferIcon fontSize="large" />,
  Mint: <AddReactionIcon fontSize="large" />,
  "Set Price": <CreditCardIcon fontSize="large" />,
  Sale: <ShoppingCartIcon fontSize="large" />,
  Transfer: <SendIcon fontSize="large" />,
};

export default memo(({ activity }) => {
  const { image, link, name, timeStr, detail } = useMemo(() => {
    const timeStr = timeSince(+activity.createdAt);

    if (activity.nft) {
      return {
        image: activity.nft.thumbnail,
        link: `/items/${activity.nft.tokenAddress}/${activity.nft.tokenId}`,
        name: activity.nft.name,
        timeStr,
        detail: activity.amount
          ? `${activity.amount} ${currencyAddressToSymbol(activity.currency)}`
          : "",
      };
    }
    if (activity.receiver) {
      return {
        image:
          activity.receiver.thumbnail ||
          activity.receiver.avatar ||
          DefaultUser,
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
      <Grid
        container
        p={3}
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item display="flex">
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
          <div style={{ marginLeft: 12 }}>
            <Typography
              color="primary"
              fontSize={22}
              fontWeight="bold"
              gutterBottom
            >
              {name}
            </Typography>
            <Grid container alignItems="center">
              <Typography color="primary" fontSize={16} mr={1}>
                {activity.event} by
              </Typography>
              <Link to={`/users/${activity.user.pubKey}`}>
                <Typography color="primary" fontWeight="bold">
                  {activity.user.name ||
                    minimizeAddress(activity.user.pubKey, 4, -6)}
                </Typography>
              </Link>
              {detail && (
                <Typography ml={1} color="primary">
                  ({detail})
                </Typography>
              )}
            </Grid>
            <Typography variant="subtitle2" color="primary" mt={1}>
              {timeStr}
            </Typography>
          </div>
        </Grid>
        <Grid item>
          {IconsMapping[activity.event] || <AutoGraphIcon fontSize="large" />}
        </Grid>
      </Grid>
    </Card>
  );
});
