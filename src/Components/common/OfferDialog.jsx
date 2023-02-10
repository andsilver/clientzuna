import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useMemo, useEffect } from "react";

import { useWeb3 } from "../../contexts/Web3Context";
import { useAuthContext } from "../../contexts/AuthContext";
import { useCurrency } from "../../contexts/CurrencyContext";

const OfferDialogContainer = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  [theme.breakpoints.up("sm")]: {},
}));

const OfferDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2, textAlign: "center" }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          size="small"
          onClick={onClose}
          color="secondary"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default function OfferDialog({
  nft,
  buying = false,
  onClose,
  onSubmit,
}) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(
    buying ? nft.currentAsk.currency : ""
  );
  const [currencyBalance, setCurrencyBalance] = useState(0);
  const { getErc20Balance } = useWeb3();
  const { user } = useAuthContext();
  const { coins, getCoinByAddress } = useCurrency();

  const symbol = useMemo(
    () => {
      const coin = getCoinByAddress(
        buying ? nft.currentAsk.currency : currency
      );
      return coin?.symbol || "";
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [coins, buying, currency, nft]
  );

  useEffect(() => {
    if (!user || !currency) {
      return;
    }

    getErc20Balance(currency, user.pubKey).then((v) =>
      setCurrencyBalance(parseFloat(+v.toFixed(4)))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, user]);

  return nft ? (
    <OfferDialogContainer onClose={onClose} open>
      <OfferDialogTitle onClose={onClose}>
        <Typography color="primary" fontWeight="bold" fontSize={22}>
          {buying ? "Checkout" : "Place a Bid"}
        </Typography>
      </OfferDialogTitle>
      <DialogContent
        sx={{
          width: 400,
        }}
      >
        <Typography color="GrayText" fontSize={18} textAlign="center">
          You are about to {buying ? "purchase" : "place a bid for"}
        </Typography>
        <Typography
          color="primary"
          fontWeight="bold"
          textAlign="center"
          fontSize={18}
        >
          {nft.name}
        </Typography>
        <Box py={3}>
          {buying ? (
            <>
              <Typography color="primary" fontWeight="bold" mb={1}>
                Buy Price
              </Typography>
              <TextField
                fullWidth
                size="small"
                disabled
                value={`${nft.currentAsk.amount} ${symbol}`}
                color="secondary"
                error={!symbol}
              />
            </>
          ) : (
            <>
              <Typography color="primary" fontSize={18} mb={1}>
                Bid Amount:
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <TextField
                    color="secondary"
                    variant="outlined"
                    fullWidth
                    placeholder="Enter price"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    fullWidth
                    color="secondary"
                  >
                    {(coins || []).map((c) => (
                      <MenuItem key={c.address} value={c.address}>
                        {c.symbol}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </>
          )}

          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            mt={1}
          >
            <Grid item>
              <Typography fontSize={18} style={{ color: "#7A798A" }}>
                Your {buying ? "buying" : "bidding"} balance:
              </Typography>
            </Grid>
            <Grid item>
              <Typography color="primary" fontSize={18} fontWeight={700}>
                {currencyBalance} {symbol}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Grid container justifyContent="center">
          <Button
            fullWidth
            autoFocus
            onClick={() => onSubmit({ amount, currency })}
            color="secondary"
            variant="contained"
            size="large"
            disabled={
              buying
                ? +nft.currentAsk.amount > +currencyBalance
                : !amount || amount > +currencyBalance
            }
          >
            {buying ? "Pay" : "Place a bid"}
          </Button>
        </Grid>
      </DialogContent>
    </OfferDialogContainer>
  ) : (
    <></>
  );
}
