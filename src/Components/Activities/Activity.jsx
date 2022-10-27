import { memo } from "react";
import { useMemo } from "react";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SendIcon from "@mui/icons-material/Send";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { Grid } from "@mui/material";

import {
  currencyAddressToSymbol,
  nFormatter,
  timeSince,
} from "../../helper/utils";
import UserLink from "../UserLink";

const IconsMapping = {
  Following: <PeopleAltIcon color="primary" />,
  Liked: <FavoriteIcon color="primary" />,
  "New Offer": <LocalOfferIcon color="primary" />,
  Mint: <AddReactionIcon color="primary" />,
  "Set Price": <CreditCardIcon color="primary" />,
  Sale: <ShoppingCartIcon color="primary" />,
  Transfer: <SendIcon color="primary" />,
};

const ACTIONS = {
  Mint: "Minted",
  "Set Price": "Price updated",
};

export default memo(({ activity }) => {
  const actionStr = useMemo(() => {
    const timeStr = timeSince(+activity.createdAt);
    const action = ACTIONS[activity.event] || "";
    let text = `${action || activity.event} ${timeStr}`;

    if (activity.amount) {
      const symbol = currencyAddressToSymbol(activity.currency);
      text += ` (${nFormatter(activity.amount)} ${symbol})`;
    }
    return text;
  }, [activity]);

  return activity?.user ? (
    <Grid container alignItems="center" justifyContent="space-between" my={0.5}>
      <Grid item>
        <UserLink user={activity.user} extraText={actionStr} />
      </Grid>
      <Grid item pr={2}>
        {IconsMapping[activity.event] || <AutoGraphIcon color="primary" />}
      </Grid>
    </Grid>
  ) : (
    <></>
  );
});
