import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Grid, MenuItem, Select, TextField } from "@mui/material";

import Switch from "../common/Switch";
import { useCurrency } from "../../contexts/CurrencyContext";
import { useSnackbar } from "../../contexts/Snackbar";

const SaleDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const SaleDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2, textAlign: "center" }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          onClick={onClose}
          color="secondary"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default function NFTSale({ nft, open, onClose, onUpdate }) {
  const { coins } = useCurrency();

  const [onSale, setOnSale] = useState(nft.onSale);
  const [price, setPrice] = useState({
    amount: nft.currentAsk?.amount || "",
    currency: nft.currentAsk?.currency || "",
  });
  const { showSnackbar } = useSnackbar();
  const [instantSale, setInstantSale] = useState(!!nft.currentAsk);

  const update = () => {
    if (price.amount && !price.currency) {
      showSnackbar({
        severity: "error",
        message: "Currency is required",
      });
      return;
    }
    onClose();
    onUpdate({ onSale, price, instantSale });
  };

  const handleCurrencyChange = (e) => {
    setPrice((p) => ({
      ...p,
      currency: e.target.value,
    }));
  };

  return (
    <SaleDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <SaleDialogTitle onClose={onClose}>Change Price</SaleDialogTitle>
      <DialogContent dividers>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          spacing={2}
        >
          <Grid item>
            <Typography fontWeight="bold">Put on sale</Typography>
            <Typography variant="subtitle2">
              You'll receive bids on this item
            </Typography>
          </Grid>
          <Grid item>
            <Switch checked={onSale} onChange={(e, v) => setOnSale(v)} />
          </Grid>
        </Grid>

        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          mb={2}
          spacing={2}
        >
          <Grid item>
            <Typography fontWeight="bold">Instant sale price</Typography>
            <Typography variant="subtitle2">
              Enter the price for which the item will be instantly sold
            </Typography>
          </Grid>
          <Grid item>
            <Switch
              checked={instantSale}
              onChange={(e, v) => setInstantSale(v)}
            />
          </Grid>
        </Grid>

        {instantSale && (
          <Grid mt={1} container spacing={2}>
            <Grid item xs={6}>
              <TextField
                color="secondary"
                variant="outlined"
                type="number"
                size="small"
                fullWidth
                placeholder="Enter price"
                value={price.amount}
                onChange={(e) =>
                  setPrice({
                    ...price,
                    amount: e.target.value,
                  })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Select
                value={price.currency}
                size="small"
                fullWidth
                color="secondary"
                onChange={handleCurrencyChange}
              >
                {coins.map((c) => (
                  <MenuItem key={c.address} value={c.address}>
                    {c.symbol}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={update}
          color="secondary"
          variant="contained"
          disabled={instantSale && !price.amount}
        >
          Save
        </Button>
        <Button autoFocus onClick={onClose} variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </SaleDialog>
  );
}
