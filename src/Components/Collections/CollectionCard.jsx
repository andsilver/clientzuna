import {
  Box,
  Card,
  Grid,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { memo } from "react";

import Link from "../Link";
import { minimizeAddress } from "../../helper/utils";

const CollectionImageContainer = styled("div")((t) => ({
  border: `2px solid ${t.theme.palette.mode === "light" ? "#eee" : "#27273a"}`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  borderRadius: "50%",
  width: 100,
  height: 100,
  marginTop: -50,
  overflow: "hidden",
  zIndex: 1,
}));

export default memo(({ collection }) => {
  const imagesData = [0, 1, 2].map((index) => {
    if (index === 0) {
      return {
        image: collection.postImages[index] || "",
        cols: 1,
        rows: 2,
      };
    }
    return {
      image: collection.postImages[index] || "",
      cols: 1,
      rows: 1,
    };
  });

  return (
    <Card sx={{ p: 2, m: 1 }}>
      <Link to={`/collections/${collection.id}`}>
        <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
          <ImageList
            sx={{ width: "100%", margin: 0 }}
            variant="quilted"
            cols={2}
            rowHeight={100}
          >
            {imagesData.map((item, index) => (
              <ImageListItem key={index} cols={item.cols} rows={item.rows}>
                <Box
                  sx={(t) => ({
                    backgroundImage: `url(${item.image})`,
                    backgroundColor:
                      t.palette.mode === "dark"
                        ? t.palette.background.default
                        : t.palette.grey[600],
                    width: "100%",
                    height: "100%",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  })}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
        <Grid container alignItems="center" flexDirection="column">
          <CollectionImageContainer
            style={{ backgroundImage: `url(${collection.image})` }}
          />
          <Typography fontWeight="bold" fontSize={22} mt={0.5}>
            {collection.name}
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography
              fontSize={16}
              sx={(t) => ({
                color:
                  t.palette.mode === "dark"
                    ? t.palette.grey[400]
                    : t.palette.grey[700],
              })}
            >
              Created By
            </Typography>
            <Link to={`/users/${collection.owner.pubKey}`}>
              <Typography fontSize={18} ml={1} fontWeight="bold">
                {collection.owner.name ||
                  minimizeAddress(collection.owner.pubKey, 4, -4)}
              </Typography>
            </Link>
          </Box>
        </Grid>
      </Link>
    </Card>
  );
});
