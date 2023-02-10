import { useState, useMemo, useEffect } from "react";
import {
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LaunchIcon from "@mui/icons-material/Launch";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import EthIcon from "../../assets/eth_ico.svg";
import { useCurrency } from "../../contexts/CurrencyContext";
import { config } from "../../config";
import UserLink from "../UserLink";
import NFTSale from "./NFTSale";
import { copyText, nFormatter } from "../../helper/utils";
import { useConfirm } from "../../contexts/Confirm";
import CollectionLink from "../CollectionLink";
import NFTTransferDialog from "./NFTTransferDialog";
import { LikeButton } from "../common/NftCard";
import { createNftShortLink } from "../../api/api";
import { useSnackbar } from "../../contexts/Snackbar";
// import NftBanner from "../common/NftBanner";

const ShareLink = styled("a")`
  margin-left: 12px;
  justify-content: center;
  align-items: center;
  text-decoration: none;
`;

const LinkMenu = styled(Menu)({
  "& .MuiPaper-root": {
    minWidth: 150,
    borderRadius: 8,
  },
});

const PanelBox = styled(Grid)(({ theme }) => ({
  padding: 12,
  borderRadius: 12,
  background:
    theme.palette.mode === "dark" ? theme.palette.background.paper : "#ececec",
}));

const ItemButton = styled(IconButton)(({ theme }) => ({
  background:
    theme.palette.mode === "dark" ? theme.palette.background.paper : "#ececec",
}));

export default function NFTInfo({
  nft,
  isMine,
  onUpdate,
  onRemoveSale,
  onBurn,
  onTransfer,
  onFavorite,
  favorited,
  favorites,
}) {
  const { coins, getCoinByAddress } = useCurrency();
  const [anchorActionEl, setAnchorActionEl] = useState(null);
  const [showSale, setShowSale] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const confirm = useConfirm();
  const [shortLink, setShortLink] = useState("");
  const { showSnackbar } = useSnackbar();

  const openAction = Boolean(anchorActionEl);

  const price = useMemo(() => {
    if (!nft || !nft.currentAsk) {
      return "";
    }
    const coin = getCoinByAddress(nft.currentAsk.currency);

    if (!coin) {
      return "";
    }
    const usdPrice = parseFloat((+nft.currentAsk.amount * coin.usd).toFixed(2));

    return {
      usdPrice: `$${usdPrice}`,
      origin: `${nFormatter(
        nft.currentAsk.amount
      )} ${coin.symbol.toLowerCase()}`,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nft, coins, getCoinByAddress]);

  useEffect(() => {
    const createShortLink = async () => {
      if (!nft) {
        setShortLink("");
        return;
      }
      try {
        const res = await createNftShortLink(nft.tokenAddress, nft.tokenId);
        setShortLink(`${config.apiUrl}/links/${res.id}`);
      } catch (err) {
        console.error(err);
      }
    };
    createShortLink();
  }, [nft]);

  const handleActionClick = (event) => {
    setAnchorActionEl(event.currentTarget);
  };

  const handleActionClose = () => {
    setAnchorActionEl(null);
  };

  const handleListingSale = async () => {
    handleActionClose();

    if (nft.onSale) {
      await confirm({
        title: "REMOVE FROM SALE",
        text: "Are you sure to remove from sale?, Existing bids will be cancelled.",
        okText: "Remove from sale",
      });
      onRemoveSale();
    } else {
      setShowSale(true);
    }
  };

  const handleCopyLink = () => {
    copyText(shortLink);
    showSnackbar({
      severity: "success",
      message: "Copied Share Link!",
    });
  };

  return nft ? (
    <>
      <Grid container justifyContent="space-between" alignItems="center" mt={1}>
        <Grid item>
          <LikeButton style={{ position: "unset" }} onClick={onFavorite}>
            {favorited ? (
              <FavoriteIcon fontSize="small" color="error" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
            &nbsp;{favorites}
          </LikeButton>
        </Grid>
        <Grid item display="flex" alignItems="center">
          <div>
            <ItemButton onClick={handleCopyLink}>
              <ContentCopyIcon />
            </ItemButton>
            <ShareLink
              href={`https://www.facebook.com/sharer/sharer.php?u=${shortLink}`}
              target="_blank"
            >
              <ItemButton>
                <FacebookIcon />
              </ItemButton>
            </ShareLink>
            <ShareLink
              href={`https://twitter.com/intent/tweet?url=${shortLink}`}
              target="_blank"
            >
              <ItemButton>
                <TwitterIcon />
              </ItemButton>
            </ShareLink>

            <ItemButton sx={{ ml: 2 }} onClick={handleActionClick}>
              <MoreVertIcon />
            </ItemButton>
            <LinkMenu
              anchorEl={anchorActionEl}
              open={openAction}
              onClose={handleActionClose}
            >
              <MenuItem
                onClick={() => {
                  handleActionClose();
                  window.open(nft.image, "_blank");
                }}
              >
                <ListItemIcon>
                  <i className="fa fa-cube" />
                </ListItemIcon>
                <ListItemText style={{ marginRight: 8 }}>
                  View on IPFS
                </ListItemText>
                <LaunchIcon fontSize="small" />
              </MenuItem>
              {nft.txHash && (
                <MenuItem
                  onClick={() => {
                    handleActionClose();
                    window.open(
                      `${config.networkScan.url}/token/${nft.tokenAddress}?a=${nft.tokenId}#inventory`,
                      "_blank"
                    );
                  }}
                >
                  <ListItemIcon>
                    <img src={EthIcon} alt="" width="16px" />
                  </ListItemIcon>
                  <ListItemText style={{ marginRight: 8 }}>
                    View on {config.networkScan.name}
                  </ListItemText>
                  <LaunchIcon fontSize="small" />
                </MenuItem>
              )}
              {isMine && <Divider />}
              {isMine && (
                <MenuItem onClick={handleListingSale}>
                  {nft.onSale ? "Remove from Sale" : "Put on Sale"}
                </MenuItem>
              )}
              {isMine && (
                <MenuItem
                  onClick={() => {
                    handleActionClose();
                    setShowSale(true);
                  }}
                >
                  Set Price
                </MenuItem>
              )}
              {isMine && nft.minted && (
                <MenuItem
                  onClick={() => {
                    handleActionClose();
                    setShowTransfer(true);
                  }}
                >
                  Transfer Token
                </MenuItem>
              )}
              {isMine && <Divider />}
              {isMine && (
                <MenuItem
                  onClick={() => {
                    handleActionClose();
                    onBurn();
                  }}
                >
                  Burn Token
                </MenuItem>
              )}
            </LinkMenu>
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={3} my={1}>
        <Grid item xs={12} sm={6} md={12} lg={6}>
          <PanelBox
            container
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography color="primary">Current Price: </Typography>
            </Grid>
            <Grid item display="flex">
              <Typography color="primary" fontSize={18} fontWeight={600}>
                {price.origin || "No Price"}
              </Typography>
              <Typography ml={1} color="primary" fontSize={12}>
                {price.usdPrice}
              </Typography>
            </Grid>
          </PanelBox>
        </Grid>
        <Grid item xs={12} sm={6} md={12} lg={6}>
          <PanelBox
            container
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography color="primary">Resale Royality: </Typography>
            </Grid>
            <Grid item>
              <Typography color="primary" fontWeight={600} fontSize={18}>
                {nft.royaltyFee / 1000}%
              </Typography>
            </Grid>
          </PanelBox>
        </Grid>
        {/* {nft.collectionId === 1 && nft.ownerId === 1 && (
          <Grid item xs={12} sm={6} md={12} lg={6}>
            <PanelBox
              container
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography color="primary">Closing in: </Typography>
              </Grid>
              <Grid item display="flex">
                <Typography color="primary" fontWeight={600} fontSize={18}>
                  <NftBanner detail />
                </Typography>
              </Grid>
            </PanelBox>
          </Grid>
        )} */}
      </Grid>
      <Typography color="primary" my={2}>
        {nft.description}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={12} lg={6}>
          <UserLink
            background
            rounded={false}
            extraText="Owned By"
            user={nft.owner}
          />
        </Grid>
        {nft.collection && (
          <Grid item xs={12} sm={6} md={12} lg={6}>
            <CollectionLink
              extraText="Collection"
              collection={nft.collection}
              rounded={false}
              background
            />
          </Grid>
        )}
      </Grid>
      <NFTSale
        open={showSale}
        nft={nft}
        onClose={() => setShowSale(false)}
        onUpdate={onUpdate}
      />
      <NFTTransferDialog
        open={showTransfer}
        onClose={() => setShowTransfer(false)}
        onSubmit={(address) => {
          setShowTransfer(false);
          onTransfer(address);
        }}
      />
    </>
  ) : (
    <></>
  );
}
