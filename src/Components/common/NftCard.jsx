import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";

import { favoriteNft } from "../../api/api";
import { nFormatter } from "../../helper/utils";
import Link from "../Link";
import UserLink from "../UserLink";
import EmptyNft from "../../assets/empty.png";
import { useCurrency } from "../../contexts/CurrencyContext";
import CoinSymbol from "./CoinSymbol";

const StyledNftCard = styled(Card)({
  width: "100%",
  borderRadius: 14,
  transition: "transform 0.2s linear",

  ".MuiCardMedia-img": {
    transition: "transform 0.2s linear",
  },

  "&:hover": {
    transform: "translateY(-12px)",

    ".MuiCardMedia-img": {
      transform: "scale(1.1)",
    },
  },
});

export const LikeButton = styled(Box)((t) => ({
  position: "absolute",
  borderRadius: 36,
  top: 26,
  right: 24,
  color: t.theme.palette.mode === "dark" ? "white" : "black",
  padding: "6px 0",
  backgroundColor:
    t.theme.palette.mode === "dark" ? "#222" : t.theme.palette.grey[300],
  cursor: "pointer",
  fontWeight: "bold",
  lineHeight: 1,
  display: "flex",
  justifyContent: "center",
  minWidth: 60,
  alignItems: "center",
}));

export default function NftCard({ nft }) {
  const [favorites, setFavorites] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const { coins, getCoinByAddress, calcUsd } = useCurrency();

  const { coin, usd } = useMemo(() => {
    if (!nft.currentAsk) {
      return "";
    }
    const coin = getCoinByAddress(nft.currentAsk.currency);
    return {
      coin,
      usd: nft.currentAsk
        ? calcUsd(nft.currentAsk.currency, nft.currentAsk.amount)
        : 0,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coins, nft]);

  const favorite = async () => {
    await favoriteNft(nft.tokenAddress, nft.tokenId);
    setFavorited(!favorited);
    setFavorites(favorited ? favorites - 1 : favorites + 1);
  };

  useEffect(() => {
    setFavorited(nft.favorited);
    setFavorites(nft.favorites);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledNftCard>
      <Box p={1} position="relative">
        <Link to={`/items/${nft.tokenAddress}/${nft.tokenId}`}>
          <CardActionArea
            sx={{ borderRadius: 3, overflow: "hidden", position: "relative" }}
          >
            <CardMedia
              image={nft.thumbnail || EmptyNft}
              title={nft.name || "Unnamed"}
              component="img"
              height={320}
            />
          </CardActionArea>
        </Link>
        <LikeButton onClick={favorite}>
          {favorited ? (
            <Favorite fontSize="small" color="error" />
          ) : (
            <FavoriteBorder fontSize="small" />
          )}
          &nbsp;{favorites}
        </LikeButton>
      </Box>
      <CardContent sx={{ position: "relative", pt: 0, pb: `12px !important` }}>
        <Typography color="primary" variant="h6" mb={1} fontWeight="bold">
          {nft.name}
        </Typography>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            <UserLink rounded={false} user={nft.owner} extraText="Owned By" />
          </Grid>
          {nft.currentAsk && (
            <Grid item>
              <Typography color="GrayText">Reserve Price</Typography>
              <CoinSymbol
                coin={coin}
                price={nFormatter(nft.currentAsk.amount)}
                usd={usd}
                size={16}
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
    </StyledNftCard>
  );
}
