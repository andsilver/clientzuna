import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import {
  bulkMintIndexMint,
  bulkMintIndexSetPrice,
  getBulkMintRequest,
  processRequest,
} from "../api/api";
import TopBanner from "../Components/common/TopBanner";
import NftRecord from "../Components/BulkMint/NftRecord";
import { useAuthContext } from "../contexts/AuthContext";
import { useWeb3 } from "../contexts/Web3Context";
import { useSnackbar } from "../contexts/Snackbar";
import OverlayLoading from "../Components/common/OverlayLoading";
import { convertTxReceipt } from "../helper/utils";

const statusColor = {
  init: "info",
  uploading: "info",
  failed: "error",
  success: "warning",
  minted: "success",
  completed: "success",
  processing: "info",
};

let timeout = null;

export default function BulkMint() {
  const { id } = useParams();
  const [req, setReq] = useState();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  const { wrongNetwork, marketContract, mediaContract } = useWeb3();
  const { showSnackbar } = useSnackbar();
  const history = useHistory();

  const fetchReq = async () => {
    try {
      const { req: request, tempNfts } = await getBulkMintRequest(id);

      if (!req || JSON.stringify(request) !== JSON.stringify(req)) {
        setReq(request);
        setItems(tempNfts);
      }

      if (request.status === "uploading" || request.status === "processing") {
        timeout = setTimeout(() => fetchReq(), 10000);
      }
    } catch (err) {
      console.error(err);
      history.push("/");
    }
  };

  const setPrice = async () => {
    if (wrongNetwork) {
      return showSnackbar({
        severity: "warning",
        message: "You are on a wrong network.",
      });
    }
    setLoading(true);

    try {
      const tokenIds = items.map((nft) => nft.tokenId);

      const erc20Addresses = [],
        amounts = [];

      items.forEach((nft) => {
        const { erc20Address, amount } = nft;
        erc20Addresses.push(
          erc20Address || "0x0000000000000000000000000000000000000000"
        );
        amounts.push(amount);
      });

      const res = await marketContract.bulkPriceSet(
        tokenIds,
        erc20Addresses,
        amounts
      );
      const receipt = await res.wait();
      const { block, logs } = convertTxReceipt(receipt);
      const request = await bulkMintIndexSetPrice(id, block, logs);
      setReq(request);

      showSnackbar({
        severity: "success",
        message: "Price has been set. The nfts will be updated soon.",
      });
    } catch (err) {
      console.error(err);
      showSnackbar({
        severity: "error",
        message: "Failed to set price",
      });
    }
    setLoading(false);
  };

  const mint = async () => {
    if (wrongNetwork) {
      return showSnackbar({
        severity: "warning",
        message: "You are on a wrong network.",
      });
    }

    try {
      await processRequest(id);
      return;
    } catch (err) {
      const { req: request } = await getBulkMintRequest(id);
      setReq(request);

      if (req.status === "minted") {
        return setPrice();
      } else if (req.status === "completed") {
        return showSnackbar({
          severity: "success",
          message: "It's already completed",
        });
      } else if (req.status !== "success") {
        console.error(err);
        showSnackbar({
          severity: "info",
          message: err?.response?.data?.message || "Please try again later",
        });
        return;
      }
    }

    try {
      setLoading(true);

      const tokenIds = items.map((nft) => nft.tokenId);

      const royalteFees = [],
        tokenUris = [];

      items.forEach((nft) => {
        const { royaltyFee, tokenUri } = nft;
        royalteFees.push(royaltyFee);
        tokenUris.push(tokenUri);
      });

      const res = await mediaContract.bulkMint(
        tokenIds,
        royalteFees,
        tokenUris,
        req.collectionId
      );
      const receipt = await res.wait();
      const { block, logs } = convertTxReceipt(receipt);
      const request = await bulkMintIndexMint(id, block, logs);
      setReq(request);

      showSnackbar({
        severity: "success",
        message:
          "Successfully minted. Please wait for some time for the nfts appearing in the marketplace.",
      });
      setPrice();
    } catch (err) {
      console.error(err);
      showSnackbar({
        severity: "error",
        message: "Failed to mint",
      });
    }
    setLoading(false);
  };

  const process = async () => {
    processRequest(id);
    setReq((data) => ({
      ...data,
      status: "processing",
    }));
  };

  useEffect(() => {
    fetchReq();
    clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ marginTop: -80 }}>
      {loading && <OverlayLoading show />}
      <TopBanner>
        <Typography
          variant="h3"
          fontWeight="bold"
          color="white"
          textAlign="center"
        >
          Bulk Mint #{id}
        </Typography>
      </TopBanner>
      {req && (
        <Container maxWidth="lg" sx={{ mb: 8, pt: 3 }}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Grid item display="flex" alignItems="center">
              <Typography variant="h6" color="primary" mr={2}>
                Status:
              </Typography>
              <Chip
                variant="outlined"
                color={statusColor[req.status]}
                label={req.status.toUpperCase()}
                sx={{ fontWeight: 900 }}
              />
            </Grid>
            <Grid item>
              {["processing", "failed", "uploading"].includes(req.status) && (
                <Button onClick={process} variant="contained" color="secondary">
                  Retry
                </Button>
              )}
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            my={4}
          >
            <Grid item>
              <Typography variant="h6" color="primary">
                {items.length} Nfts:
              </Typography>
            </Grid>
            <Grid item>
              {user?.id === req.userId && req.status === "success" && (
                <Button onClick={mint} variant="contained" color="secondary">
                  Mint
                </Button>
              )}
              {user?.id === req.userId && req.status === "minted" && (
                <Button
                  onClick={setPrice}
                  variant="contained"
                  color="secondary"
                >
                  Set Price
                </Button>
              )}
              {req.status === "processing" && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ width: "300px", mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      color="secondary"
                      value={Math.round(
                        (req.processedNfts * 100) / req.totalNfts
                      )}
                    />
                  </Box>
                  <Box sx={{ mr: 1 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >{`${Math.round(
                      (req.processedNfts * 100) / req.totalNfts
                    )}%`}</Typography>
                  </Box>
                  <CircularProgress size={16} />
                </Box>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            {items.map((item) => (
              <NftRecord key={item.id} nft={item} />
            ))}
          </Grid>
        </Container>
      )}
    </div>
  );
}
