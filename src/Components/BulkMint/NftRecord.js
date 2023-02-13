import {
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { memo, useMemo } from "react";
import CheckCircle from "@mui/icons-material/CheckCircle";

import { useCurrency } from "../../contexts/CurrencyContext";
import CoinSymbol from "../common/CoinSymbol";
import { fromWei } from "../../helper/utils";

export default memo(({ nft }) => {
  const { getCoinByAddress } = useCurrency();

  const price = useMemo(() => {
    const coin = getCoinByAddress(nft.erc20Address);

    if (!coin) {
      return;
    }
    const amount = fromWei(nft.amount, coin.decimals);
    const usd = parseFloat((+amount * coin.usd).toFixed(2));

    return { coin, amount, usd };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nft]);

  return (
    <Grid item xs={12} sm={6}>
      <Card>
        <CardContent>
          <Grid
            container
            alignItems="center"
            sx={{
              py: 1,
            }}
            spacing={3}
            justifyContent="space-between"
          >
            <Grid item>
              <Typography color="primary" fontWeight={600}>
                {nft.name}
              </Typography>
            </Grid>
            <Grid item>
              {nft.processed ? (
                <CheckCircle color="success" />
              ) : (
                <CircularProgress size={16} />
              )}
            </Grid>
          </Grid>
          <Typography variant="body1" my={2} color="primary">
            {nft.description}
          </Typography>
          <Grid
            container
            alignItems="center"
            spacing={3}
            justifyContent="space-between"
          >
            <Grid item>
              <Chip color="secondary" label={nft.category} />
            </Grid>
            <Grid item>
              {price && (
                <CoinSymbol
                  coin={price.coin}
                  usd={price.usd}
                  price={price.amount}
                />
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
});
