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
import { currencyAddressToSymbol, nFormatter } from "../../helper/utils";
import Link from "../Link";
import UserLink from "../UserLink";

const StyledNftCard = styled(Card)({
  width: "100%",
  borderRadius: 14,
  transition: "transform 0.2s linear",

  '.MuiCardMedia-img': {
    transition: "transform 0.2s linear",
  },

  "&:hover": {
    transform: "translateY(-16px)",

    '.MuiCardMedia-img': {
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
      <Box p={2} position="relative">
        <Link to={`/items/${nft.id}`}>
          <CardActionArea sx={{ borderRadius: 2, overflow: "hidden" }}>
            <CardMedia
              image={nft.thumbnail}
              title={nft.name}
              component="img"
              height={280}
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
      <CardContent sx={{ position: "relative", pt: 0 }}>
        <Typography color="primary" variant="h6" mb={1} fontWeight="bold">
          {nft.name}
        </Typography>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <UserLink rounded={false} user={nft.owner} extraText="Owned By" />
          </Grid>
          <Grid item>
            <Typography color="GrayText">Reserve Price</Typography>
            <Typography fontWeight="bold" color="primary">
              {nft.currentAsk
                ? `${nFormatter(nft.currentAsk.amount)} ${symbol}`
                : "No Price"}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </StyledNftCard>
  );
}
