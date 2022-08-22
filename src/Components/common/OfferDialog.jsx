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
import { config } from "../../config";
import { currencyAddressToSymbol, currencyList } from "../../helper/utils";
import { useWeb3 } from "../../contexts/Web3Context";
import { useAuthContext } from "../../contexts/AuthContext";

const OfferDialogContainer = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
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

const currencies = currencyList();

export default function OfferDialog({
  nft,
  buying = false,
  onClose,
  onSubmit,
  open,
}) {
  const [amount, setAmount] = useState("");
  const [currency] = useState(
    buying ? nft.currentAsk.currency : config.currencies.WBNB.address
  );
  const [currencyBalance, setCurrencyBalance] = useState(0);
  const { getErc20Balance } = useWeb3();
  const { user, balance } = useAuthContext();

  const symbol = useMemo(
    () => currencyAddressToSymbol(buying ? nft.currentAsk.currency : currency),
    [currency, nft, buying]
  );

  useEffect(() => {
    if (!user || !currency) {
      return;
    }
    getErc20Balance(currency, user.pubKey).then((v) =>
      setCurrencyBalance(parseFloat(v).toFixed(4))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, user]);

  return nft ? (
    <OfferDialogContainer onClose={onClose} open={open}>
      <OfferDialogTitle onClose={onClose}>
        <Typography color="primary" fontWeight="bold">
          {buying ? "CHECKOUT" : "PLACE A BID"}
        </Typography>
      </OfferDialogTitle>
      <DialogContent>
        <Typography color="primary" variant="subtitle2">
          You are about to {buying ? "purchase" : "place a bid for"}
        </Typography>
        <Typography color="primary" fontWeight="bold">
          {nft.name}
        </Typography>
        <Box
          px={2}
          py={3}
          mt={1}
          sx={{
            border: (t) => `2px solid ${t.palette.secondary.main}`,
            borderRadius: 2,
            backgroundColor: (t) => t.palette.background.default,
          }}
        >
          {buying ? (
            <>
              <Typography
                variant="subtitle2"
                color="primary"
                fontWeight="bold"
                mb={1}
              >
                Buy Price
              </Typography>
              <TextField
                fullWidth
                size="small"
                disabled
                value={`${nft.currentAsk.amount} ${symbol}`}
                color="secondary"
              />
            </>
          ) : (
            <>
              <Typography
                variant="subtitle2"
                color="primary"
                fontWeight="bold"
                mb={1}
              >
                Your Bid
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    color="secondary"
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="Enter price"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Select
                    value={currency}
                    size="small"
                    fullWidth
                    color="secondary"
                  >
                    {currencies.map((c) => (
                      <MenuItem key={c.value} value={c.value}>
                        {c.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </>
          )}

          <Grid
            mt={3}
            container
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <Typography color="primary" variant="subtitle2">
                Your balance
              </Typography>
            </Grid>
            <Grid item>
              <Typography color="primary" variant="subtitle2" fontWeight={600}>
                {balance} {config.nativeCurrency}
              </Typography>
            </Grid>
          </Grid>

          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <Typography color="primary" variant="subtitle2">
                Your {buying ? "buying" : "bidding"} balance
              </Typography>
            </Grid>
            <Grid item>
              <Typography color="primary" variant="subtitle2" fontWeight={600}>
                {currencyBalance} {symbol}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <Grid container justifyContent="center" py={2}>
        <Button
          style={{
            boxShadow: "none",
            minWidth: 120,
          }}
          autoFocus
          onClick={() => onSubmit({ amount, currency })}
          color="secondary"
          variant="contained"
          disabled={
            buying
              ? +nft.currentAsk.amount > +currencyBalance
              : !amount || amount > +currencyBalance
          }
        >
          {buying ? "Pay" : "Place a bid"}
        </Button>
      </Grid>
    </OfferDialogContainer>
  ) : (
    <></>
  );
}
