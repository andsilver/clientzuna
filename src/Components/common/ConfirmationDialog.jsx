import { Button, DialogContent, Grid, Typography } from "@mui/material";
import { memo } from "react";
import { StyledDialog, StyledDialogTitle } from "./DialogElements";

export default memo(
  ({
    options: { title, text, okText, cancelText },
    onClose,
    open,
    onCancel,
    onConfirm,
  }) => {
    return (
      <StyledDialog onClose={onClose} open={open}>
        <StyledDialogTitle onClose={onClose}>
          <Typography color="primary" fontWeight="bold">
            {title}
          </Typography>
        </StyledDialogTitle>
        {text && (
          <DialogContent style={{ minWidth: 340, textAlign: "center" }}>
            {text}
          </DialogContent>
        )}
        <Grid container justifyContent="center" py={2} spacing={2}>
          <Grid item>
            <Button
              style={{
                boxShadow: "none",
              }}
              autoFocus
              onClick={onConfirm}
              color="secondary"
              variant="contained"
            >
              {okText}
            </Button>
          </Grid>
          <Grid item>
            {cancelText && (
              <Button onClick={onCancel} variant="outlined">
                {cancelText}
              </Button>
            )}
          </Grid>
        </Grid>
      </StyledDialog>
    );
  }
);
