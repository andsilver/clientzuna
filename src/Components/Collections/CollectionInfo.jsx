import { Edit } from "@mui/icons-material";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import ShareIcon from "@mui/icons-material/Share";
import FacebookIcon from "@mui/icons-material/Facebook";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PublishIcon from "@mui/icons-material/Publish";
import {
  Box,
  Button,
  Chip,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { memo, useState } from "react";

import { config } from "../../config";

import UserLink from "../UserLink";
import { copyText, nFormatter } from "../../helper/utils";
import { useSnackbar } from "../../contexts/Snackbar";

const CollectionImage = styled("div")((t) => ({
  border: `3px solid ${t.theme.palette.mode === "light" ? "#eee" : "#27273a"}`,
  borderRadius: 14,
  width: 200,
  height: 200,
  marginTop: -160,
  overflow: "hidden",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  [t.theme.breakpoints.down("sm")]: {
    width: 120,
    height: 120,
    marginTop: -80,
  },
}));

const CollectionInfoBox = styled(Box)((t) => ({
  border: `2px solid ${t.theme.palette.mode === "light" ? "#eee" : "#27273a"}`,
  borderRadius: 14,
}));

export default memo(({ collection, onEdit, isOwner, onImport }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { showSnackbar } = useSnackbar();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCopyLink = () => {
    copyText(shortLink);
    handleClose();
    showSnackbar({
      severity: "success",
      message: "Copied Share Link!",
    });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const shortLink = `${config.apiUrl}/links/${collection.shortLink.id}`;

  return (
    <div>
      <Grid container justifyContent="space-between" alignItems="start">
        <Grid item>
          <CollectionImage
            style={{
              backgroundImage: `url(${collection.image})`,
            }}
          />
        </Grid>
        <Grid item>
          {isOwner && (
            <>
              <Button
                style={{ marginTop: 12 }}
                variant="outlined"
                color="primary"
                startIcon={<PublishIcon />}
                onClick={onImport}
              >
                Bulk Mint
              </Button>
              <Button
                style={{ marginTop: 12, marginLeft: 12 }}
                variant="outlined"
                color="primary"
                startIcon={<Edit />}
                onClick={onEdit}
              >
                Edit
              </Button>
            </>
          )}
          <Button
            variant="outlined"
            color="primary"
            onClick={handleOpen}
            style={{ marginTop: 12, marginLeft: 12 }}
            startIcon={<ShareIcon />}
          >
            Share
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <a
              href={`https://twitter.com/intent/tweet?url=${shortLink}`}
              target="_blank"
              style={{ color: "unset", textDecoration: "none" }}
              rel="noreferrer"
            >
              <MenuItem onClick={() => handleClose()}>
                <ListItemIcon>
                  <TwitterIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Twitter</ListItemText>
              </MenuItem>
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shortLink}`}
              target="_blank"
              style={{ color: "unset", textDecoration: "none" }}
              rel="noreferrer"
            >
              <MenuItem onClick={() => handleClose()}>
                <ListItemIcon>
                  <FacebookIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Facebook</ListItemText>
              </MenuItem>
            </a>
            <MenuItem onClick={() => handleCopyLink()}>
              <ListItemIcon>
                <ContentCopyIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Copy Link</ListItemText>
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
      <Grid container spacing={3} justifyContent="space-between">
        <Grid item xs={12} md={6}>
          <Typography
            mt={2}
            variant="h4"
            fontWeight="bold"
            color="primary"
            mb={2}
          >
            {collection.name}
          </Typography>
          <UserLink
            user={collection.owner}
            size={60}
            extraText="Created By"
            fontSize={18}
          />
          <Typography color="primary" variant="subtitle1" mt={2}>
            {collection.description}
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <CollectionInfoBox mt={3} p={2}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography color="gray" fontWeight="600">
                  Floor
                </Typography>
              </Grid>
              <Grid item>
                <Typography color="primary" fontWeight="bold">
                  {nFormatter(collection.floorPrice)}{" "}
                  {collection.floorPriceCurrency?.toUpperCase() || ""}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Grid item>
                <Typography color="gray" fontWeight="600">
                  Volume
                </Typography>
              </Grid>
              <Grid item>
                <Typography color="primary" fontWeight="bold">
                  ${collection.totalVolume}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Grid item>
                <Typography color="gray" fontWeight="600">
                  Owners
                </Typography>
              </Grid>
              <Grid item>
                <Typography color="primary" fontWeight="bold">
                  {collection.owners}
                </Typography>
              </Grid>
            </Grid>
            {collection.category && (
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <Grid item>
                  <Typography color="gray" fontWeight="600">
                    Category
                  </Typography>
                </Grid>
                <Grid item>
                  <Chip
                    size="small"
                    label={collection.category}
                    color="secondary"
                  />
                </Grid>
              </Grid>
            )}
          </CollectionInfoBox>
          <Grid
            container
            spacing={1}
            justifyContent="flex-end"
            alignItems="center"
            pr={2}
          >
            {collection.instagram && (
              <Grid item mt={2}>
                <a
                  href={`https://instagram.com/${collection.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <InstagramIcon color="primary" />
                </a>
              </Grid>
            )}
            {collection.twitter && (
              <Grid item mt={2}>
                <a
                  href={`https://twitter.com/${collection.twitter}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <TwitterIcon color="primary" />
                </a>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
});
