import {
  Button,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { StyledDialog, StyledDialogTitle } from "../common/DialogElements";

export default function NFTTransferDialog({ onClose, open, onSubmit }) {
  const [address, setAddress] = useState("");

  return (
    <StyledDialog onClose={onClose} open={open}>
      <StyledDialogTitle onClose={onClose}>Transfer NFT</StyledDialogTitle>
      <DialogContent>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          Wallet Address
        </Typography>
        <TextField
          color="secondary"
          variant="outlined"
          size="small"
          fullWidth
          label=""
          placeholder="0xfff..."
          value={address}
          style={{ minWidth: 300 }}
          onChange={(e) => setAddress(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => onSubmit(address)}
          color="secondary"
          variant="contained"
          disabled={!address}
        >
          Transfer
        </Button>
        <Button autoFocus onClick={onClose} variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
