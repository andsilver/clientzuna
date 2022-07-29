import { useState, useMemo } from "react";
import {
  Button,
  Divider,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import TelegramIcon from "@mui/icons-material/Telegram";
import EmailIcon from "@mui/icons-material/Email";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LaunchIcon from "@mui/icons-material/Launch";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import EthIcon from "../../assets/eth_ico.svg";
import { useCoinGecko } from "../../contexts/CoinGeckoContext";
import { config } from "../../config";
import UserLink from "../UserLink";
import NFTSale from "./NFTSale";
import { currencyAddressToSymbol } from "../../helper/utils";
import { useConfirm } from "../../contexts/Confirm";
import CollectionLink from "../CollectionLink";
import NFTTransferDialog from "./NFTTransferDialog";

const NFTRoyaltyContainer = styled("div")`
  font-size: 12px;
  background: ${(t) => t.theme.palette.error.main};
  padding: 5px 13px;
  border-radius: 15px 6px 6px 15px;
  color: white;
  text-align: center;
  font-weight: 700;
  margin-bottom: 15px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  width: 215px;
  position: relative;
`;

const ShareLink = styled("a")`
  display: inline-flex;
  border-radius: 50%;
  height: 35px;
  width: 35px;
  margin-left: 2px;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  border-radius: 5px;
  margin-right: 5px;
  color: ${(t) => t.theme.palette.primary.main};
  text-decoration: none;

  &:hover {
    color: ${(t) => t.theme.palette.secondary.main};
  }
`;

const LinkMenu = styled(Menu)({
  "& .MuiPaper-root": {
    minWidth: 150,
    borderRadius: 8,
  },
});

export default function NFTInfo({
  nft,
  isMine,
  onUpdate,
  onRemoveSale,
  onBurn,
  onTransfer,
}) {
  const { coins } = useCoinGecko();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorActionEl, setAnchorActionEl] = useState(null);
  const [showSale, setShowSale] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const confirm = useConfirm();

  const open = Boolean(anchorEl);
  const openAction = Boolean(anchorActionEl);

  const price = useMemo(() => {
    if (!nft || !nft.currentAsk) {
      return "";
    }
    const symbol = currencyAddressToSymbol(nft.currentAsk.currency);
    const coin = coins[symbol];

    if (!coin) {
      return "";
    }
    const usdPrice = (+nft.currentAsk.amount * coin.price).toFixed(3);

    return `${nft.currentAsk.amount} ${symbol.toLowerCase()} ($ ${usdPrice})`;
  }, [nft, coins]);

  const handleActionClick = (event) => {
    setAnchorActionEl(event.currentTarget);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  return nft ? (
    <>
      <Grid container justifyContent="space-between" mt={2}>
        <Grid item>
          <NFTRoyaltyContainer>
            <i className="fa fa-tags" />
            &nbsp;{nft.royaltyFee / 1000} % of resale royalty
          </NFTRoyaltyContainer>
        </Grid>
        <Grid item display="flex" alignItems="center">
          <Typography color="primary" variant="subtitle1" mr={1}>
            share via
          </Typography>
          <div>
            <ShareLink
              href={`https://www.facebook.com/sharer/sharer.php?u=http://zunaverse.live/items/${nft.id}&caption=${nft.name}&description=${nft.description}`}
              target="_blank"
            >
              <FacebookIcon />
            </ShareLink>
            <ShareLink target="_blank">
              <TwitterIcon />
            </ShareLink>
            <ShareLink target="_blank">
              <TelegramIcon />
            </ShareLink>
            <ShareLink target="_blank">
              <EmailIcon />
            </ShareLink>
          </div>
        </Grid>
      </Grid>
      {price && (
        <Typography mt={2} color="primary" fontWeight="bold">
          {price}
        </Typography>
      )}
      <Typography color="primary" mt={2} mb={1}>
        {nft.description}
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        style={{ borderRadius: 4 }}
        endIcon={<ExpandMoreIcon />}
        onClick={handleClick}
      >
        View proof of authenticity
      </Button>

      {isMine && (
        <>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            style={{ borderRadius: 4, marginLeft: 12 }}
            endIcon={<MoreVertIcon />}
            onClick={handleActionClick}
          >
            More Options
          </Button>
          <LinkMenu
            anchorEl={anchorActionEl}
            open={openAction}
            onClose={handleActionClose}
          >
            <MenuItem onClick={handleListingSale}>
              {nft.onSale ? "Remove from Sale" : "Put on Sale"}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleActionClose();
                setShowSale(true);
              }}
            >
              Set Price
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleActionClose();
                setShowTransfer(true);
              }}
            >
              Transfer Token
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                handleActionClose();
                onBurn();
              }}
            >
              Burn Token
            </MenuItem>
          </LinkMenu>
        </>
      )}

      <LinkMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
            window.open(nft.image, "_blank");
          }}
        >
          <ListItemIcon>
            <i className="fa fa-cube" />
          </ListItemIcon>
          <ListItemText style={{ marginRight: 8 }}>View on IPFS</ListItemText>
          <LaunchIcon fontSize="small" />
        </MenuItem>
        {nft.txHash && (
          <MenuItem
            onClick={() => {
              handleClose();
              window.open(
                `${config.networkScan.url}/tx/${nft.txHash}`,
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
      </LinkMenu>
      <Divider style={{ marginTop: 20, marginBottom: 20 }} />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography color="primary" variant="subtitle2" gutterBottom>
            Creator
          </Typography>
          <UserLink user={nft.creator} />
        </Grid>
        {nft.collection && (
          <Grid item xs={6}>
            <Typography color="primary" variant="subtitle2" gutterBottom>
              Collection
            </Typography>
            <CollectionLink collection={nft.collection} />
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
