import { memo } from "react";
import { useMemo } from "react";
import { useCurrency } from "../../contexts/CurrencyContext";
import { nFormatter, timeSince } from "../../helper/utils";
import UserLink from "../UserLink";

export default memo(({ bid }) => {
  const { coins, getCoinByAddress } = useCurrency();

  const actionStr = useMemo(() => {
    const timeStr = timeSince(bid.createdAt);
    const coin = getCoinByAddress(bid.currency);
    const symbol = coin?.symbol || "";

    return `Bid placed for ${nFormatter(bid.amount)} ${symbol} ${timeStr}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bid, coins]);

  return <UserLink user={bid.bidder} extraText={actionStr} />;
});
