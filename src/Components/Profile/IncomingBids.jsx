import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import moment from "moment";

import { getUserIncomingBids } from "../../api/api";
import useLoading from "../../hooks/useLoading";
import useQuery from "../../hooks/useQuery";
import NoData from "../NoData";
import SectionLoading from "../SectionLoading";
import { useCurrency } from "../../contexts/CurrencyContext";
import { nFormatter } from "../../helper/utils";
import BidsTable from "./BidsTable";

export default function IncomingBids({ userAddress, incoming }) {
  const [bids, setBids] = useState([]);
  const [allLoaded, setAllLoaded] = useState(false);
  const { loading, sendRequest } = useLoading();
  const query = useQuery();
  const { getCoinByAddress } = useCurrency();

  const fetchIncomingBids = async (init) => {
    const res = await sendRequest(() =>
      getUserIncomingBids(userAddress, {
        offset: init ? 0 : bids.length,
      })
    );

    if (res) {
      const result = res.map((b) => {
        const coin = getCoinByAddress(b.currency);
        const amount = b.amount;
        const usd = parseFloat((+amount * coin.usd).toFixed(2));

        return {
          ...b,
          price: {
            coin,
            amount: nFormatter(amount),
            usd,
          },
          createdAt: moment(b.createdAt).format("YYYY-MM-DD hh:mm"),
        };
      });
      setAllLoaded(result.length < 20);
      setBids(init ? result : [...bids, ...result]);
    } else {
      setAllLoaded(true);
    }
  };

  useEffect(() => {
    if (!userAddress) {
      return;
    }
    fetchIncomingBids(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress, query]);

  return (
    <div>
      {bids.length ? (
        <BidsTable bids={bids} incoming={incoming} />
      ) : (
        !loading && <NoData />
      )}
      {!allLoaded && !loading && (
        <Grid container justifyContent="center" mt={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => fetchIncomingBids()}
            sx={{ minWidth: 200 }}
          >
            Load More
          </Button>
        </Grid>
      )}
      {loading && <SectionLoading />}
    </div>
  );
}
