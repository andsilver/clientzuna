import { memo } from "react";
import { useMemo } from "react";
import { currencyAddressToSymbol, timeSince } from "../../helper/utils";
import UserLink from "../UserLink";

export default memo(({ bid }) => {
  const actionStr = useMemo(() => {
    const timeStr = timeSince(bid.createdAt);
    const symbol = currencyAddressToSymbol(bid.currency);

    return `Bid placed for ${bid.amount} ${symbol} ${timeStr}`;
  }, [bid]);

  return <UserLink user={bid.bidder} extraText={actionStr} />;
});
