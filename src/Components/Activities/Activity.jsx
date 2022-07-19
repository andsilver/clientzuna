import { memo } from "react";
import { useMemo } from "react";
import { currencyAddressToSymbol, timeSince } from "../../helper/utils";
import UserLink from "../UserLink";

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
      text += ` (${activity.amount} ${symbol})`;
    }
    return text;
  }, [activity]);

  return activity?.user ? (
    <UserLink user={activity.user} extraText={actionStr} />
  ) : (
    <></>
  );
});
