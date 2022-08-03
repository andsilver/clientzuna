import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  styled,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";

import { favoriteNft } from "../../api/api";
import { currencyAddressToSymbol } from "../../helper/utils";
import Link from "../Link";
import UserLink from "../UserLink";

const StyledNftCard = styled(Card)({
  width: "100%",
  borderRadius: 10,
});

const LikeButton = styled(Box)((t) => ({
  position: "absolute",
  right: 0,
  borderTopLeftRadius: 40,
  borderBottomLeftRadius: 40,
  top: -18,
  color: "white",
  padding: "6px 10px 6px 14px",
  backgroundColor: t.theme.palette.secondary.main,
  cursor: "pointer",
  fontWeight: "bold",
  lineHeight: 1,
  display: "flex",
  alignItems: "center",
}));

export default function NftCard({ nft }) {
  const [favorites, setFavorites] = useState(0);
  const [favorited, setFavorited] = useState(false);

  const symbol = useMemo(() => {
    if (!nft.currentAsk) {
      return "";
    }
    return currencyAddressToSymbol(nft.currentAsk.currency);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nft]);

  const favorite = async () => {
    await favoriteNft(nft.id);
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
      <Link to={`/items/${nft.id}`}>
        <CardActionArea>
          <CardMedia
            image={nft.thumbnail}
            title={nft.name}
            component="img"
            height={240}
          />
        </CardActionArea>
      </Link>
      <CardContent style={{ position: "relative" }}>
        <LikeButton onClick={favorite}>
          {favorited ? (
            <Favorite fontSize="small" color="error" />
          ) : (
            <FavoriteBorder fontSize="small" />
          )}
          &nbsp;{favorites}
        </LikeButton>
        <Typography color="primary" variant="h6" mb={1}>
          {nft.name}
        </Typography>
        <UserLink size={32} user={nft.owner} />
        <Box mt={3}>
          <Typography color="GrayText">Reserve Price</Typography>
          <Typography fontWeight="bold" color="primary">
            {nft.currentAsk ? `${nft.currentAsk.amount} ${symbol}` : "No Price"}
          </Typography>
        </Box>
      </CardContent>
    </StyledNftCard>
  );
}
