import { Chip, Grid, styled, Typography } from "@mui/material";
import { useMemo } from "react";
import { nFormatter } from "../../helper/utils";

const PanelBox = styled(Grid)(({ theme }) => ({
  padding: 12,
  borderRadius: 12,
  background:
    theme.palette.mode === "dark" ? theme.palette.background.paper : "#ececec",
}));

export default function NftPreview({ preview, nft, coins }) {
  const price = useMemo(() => {
    if (!nft || !coins) {
      return;
    }

    if (!nft.amount) {
      return;
    }
    const coin = coins.find((coin) => coin.symbol === nft.currency);

    if (!coin) {
      return;
    }
    const usdPrice = parseFloat((+nft.amount * coin.usd).toFixed(2));

    return {
      usdPrice: `$${usdPrice}`,
      origin: `${nFormatter(nft.amount)} ${nft.currency}`,
    };
  }, [nft, coins]);

  return (
    <div style={{ paddingLeft: 8, paddingRight: 8 }}>
      <div style={{ textAlign: "center" }}>
        <img
          src={preview}
          alt=""
          width="100%"
          height="auto"
          style={{ borderRadius: 10, maxWidth: 300 }}
        />
      </div>
      <div>
        <Grid container justifyContent="space-between" mt={1} spacing={2}>
          <Grid item>
            <Typography variant="h6" color="primary" gutterBottom>
              {nft.name}
            </Typography>
          </Grid>
          <Grid item>
            <Chip
              size="small"
              label={nft.category}
              color="secondary"
              sx={{
                textTransform: "capitalize",
              }}
            />
          </Grid>
        </Grid>
        <Typography variant="body1" color="primary" gutterBottom>
          {nft.description}
        </Typography>
        {nft.properties?.length > 0 && (
          <div>
            <Typography mt={2} color="primary" fontWeight={600}>
              Properties
            </Typography>
            <Grid container spacing={2}>
              {nft.properties.map((p, index) => (
                <Grid item key={index}>
                  <Typography color="primary" variant="subtitle2">
                    {p.name} - {p.value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </div>
        )}
        <Grid container spacing={3} mt={1} mb={1}>
          <Grid item xs={12} sm={6} md={12} lg={6}>
            <PanelBox
              container
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography color="primary">Price: </Typography>
              </Grid>
              <Grid item display="flex">
                <Typography color="primary" fontSize={14} fontWeight={600}>
                  {price?.origin || "No Price"}
                </Typography>
                <Typography ml={1} color="primary" fontSize={12}>
                  {price?.usdPrice || ""}
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
                <Typography color="primary" fontWeight={600} fontSize={14}>
                  {nft.royaltyFee}%
                </Typography>
              </Grid>
            </PanelBox>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
