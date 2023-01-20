import { useEffect, useState, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import Web3 from "web3";
import { Box, Button, Container, Grid, Typography } from "@mui/material";

import { useSnackbar } from "../contexts/Snackbar";
import {
  burnNFT,
  favoriteNft,
  getNft,
  getNftBids,
  placeBid,
  removeBid,
  removeNFTSale,
  updateNFTSale,
} from "../api/api";
import OverlayLoading from "../Components/common/OverlayLoading";
import NFTInfo from "../Components/NFTDetail/NFTInfo";
import NFTHistory from "../Components/NFTDetail/NFTHistory";
import { useAuthContext } from "../contexts/AuthContext";
import { useWeb3 } from "../contexts/Web3Context";
import { getCurrencyDecimals, sameAddress, toWei, wait } from "../helper/utils";
import OfferDialog from "../Components/common/OfferDialog";
import { config } from "../config";
import { useConfirm } from "../contexts/Confirm";
import Meta from "../Components/common/Meta";
import EmptyNft from "../assets/empty.png";

const types = {
  Offer: [
    {
      name: "tokenId",
      type: "uint256",
    },
    {
      name: "erc20Address",
      type: "address",
    },
    {
      name: "amount",
      type: "uint256",
    },
    {
      name: "createdAt",
      type: "uint256",
    },
  ],
};

const typesMarket2 = {
  Offer: [
    {
      name: "tokenId",
      type: "uint256",
    },
    {
      name: "tokenAddress",
      type: "address",
    },
    {
      name: "erc20Address",
      type: "address",
    },
    {
      name: "amount",
      type: "uint256",
    },
    {
      name: "createdAt",
      type: "uint256",
    },
  ],
};

const NFTDetailComponent = () => {
  const { user } = useAuthContext();
  const {
    wrongNetwork,
    showWrongNetworkWarning,
    signEIP712,
    contracts,
    getErc20Balance,
    getErc721Contract,
    approveMarket,
  } = useWeb3();
  const [nft, setNft] = useState();
  const { tokenAddress, tokenId } = useParams();
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [bids, setBids] = useState([]);
  const [offerType, setOfferType] = useState("");
  const confirm = useConfirm();
  const history = useHistory();
  const [favorites, setFavorites] = useState(0);
  const [favorited, setFavorited] = useState(false);

  const isZunaNFT =
    tokenAddress?.toLowerCase() === config.nftContractAddress.toLowerCase();

  const selectedMarketAddress = isZunaNFT
    ? config.marketContractAddress
    : config.market2ContractAddress;

  const erc721Contract = useMemo(() => {
    if (!tokenAddress) {
      return null;
    }
    return getErc721Contract(tokenAddress);
  }, [tokenAddress, getErc721Contract]);

  const favorite = async () => {
    if (!user) {
      showSnackbar({
        severity: "warning",
        message: "You should loggin first.",
      });
      return;
    }
    await favoriteNft(nft.tokenAddress, nft.tokenId);
    setFavorited(!favorited);
    setFavorites(favorited ? favorites - 1 : favorites + 1);
  };

  useEffect(() => {
    if (!nft) {
      return;
    }
    setFavorited(nft.favorited);
    setFavorites(nft.favorites);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nft]);

  const isMine = useMemo(() => {
    if (!nft || !user) {
      return false;
    }
    return sameAddress(nft.owner.pubKey, user.pubKey);
  }, [nft, user]);

  const fetchNFT = async () => {
    setLoading(true);
    try {
      const res = await Promise.all([
        getNft(tokenAddress, tokenId),
        getNftBids(tokenAddress, tokenId),
      ]);
      setNft(res[0]);
      setBids(res[1]);
    } catch (err) {
      console.error(err);
      showSnackbar({ severity: "error", message: "Failed to load the nft" });
    }
    setLoading(false);
  };

  const removeSale = async () => {
    setLoading(true);

    try {
      await removeNFTSale(nft.tokenAddress, nft.tokenId);
      await fetchNFT();
    } catch (err) {
      console.error(err);
      showSnackbar({ severity: "error", message: "Failed to remove sale" });
    }
    setLoading(false);
  };

  const updateSale = async (data) => {
    if (wrongNetwork) {
      showWrongNetworkWarning();
      return;
    }

    if (data.instantSale || data.onSale) {
      await approveNFT();
      await approveMarket(data.price.currency, selectedMarketAddress);
    }

    setLoading(true);

    try {
      if (data.instantSale) {
        const decimals = getCurrencyDecimals(data.price.currency);
        const listing = {
          tokenId: nft.tokenId,
          erc20Address: data.price.currency,
          amount: toWei(data.price.amount, decimals),
          createdAt: `${Date.now()}`,
        };

        if (!isZunaNFT) {
          listing.tokenAddress = nft.tokenAddress;
        }

        const signature = await signEIP712(
          isZunaNFT ? types : typesMarket2,
          listing,
          isZunaNFT ? "market" : "market2"
        );

        if (!signature) {
          throw new Error("Signature Required");
        }
        listing.signature = signature;

        await updateNFTSale(nft.tokenAddress, nft.tokenId, {
          ...data,
          typedData: listing,
        });
      } else {
        await updateNFTSale(nft.tokenAddress, nft.tokenAddress, data);
      }
      await fetchNFT();
      showSnackbar({
        severity: "success",
        message: "The nft sale has been updated.",
      });
    } catch (err) {
      console.error(err);
      showSnackbar({ severity: "error", message: "Failed to set nft sale" });
    }
    setLoading(false);
  };

  const handleOffer = async (data) => {
    if (wrongNetwork) {
      showWrongNetworkWarning();
      return;
    }
    setLoading(true);

    const buying = offerType === "buy";

    try {
      const decimals = getCurrencyDecimals(
        buying ? nft.currentAsk.currency : data.currency
      );
      const amount = buying
        ? nft.currentAsk.typedData.amount
        : toWei(data.amount, decimals);

      await approveMarket(data.currency, selectedMarketAddress);

      if (buying) {
        try {
          if (nft.minted) {
            const marketContract = isZunaNFT
              ? contracts.market
              : contracts.market2;

            await marketContract.methods
              .buy(user.pubKey, nft.currentAsk.typedData)
              .send({ from: user.pubKey });
          } else {
            await contracts.media.methods
              .lazyBuyMint(
                nft.tokenId,
                {
                  tokenId: nft.tokenId,
                  royaltyFee: nft.royaltyFee,
                  collectionId: nft.collectionId || 0,
                  tokenUri: nft.tokenUri,
                  signature: nft.signature,
                },
                nft.currentAsk.typedData
              )
              .send({ from: user.pubKey });
          }
        } catch (err) {
          setLoading(false);
          showSnackbar({
            severity: "error",
            message: "Buying transaction has been failed.",
          });
          throw err;
        }
        await wait(20);
        await fetchNFT();
        showSnackbar({
          severity: "success",
          message: "The nft has been bought successfully.",
        });
      } else {
        const offer = {
          tokenId: nft.tokenId,
          erc20Address: data.currency,
          amount,
          createdAt: Date.now().toString(),
        };

        if (!isZunaNFT) {
          offer.tokenAddress = nft.tokenAddress;
        }

        const signature = await signEIP712(
          isZunaNFT ? types : typesMarket2,
          offer,
          isZunaNFT ? "market" : "market2"
        );

        if (!signature) {
          throw new Error("Signature Required");
        }

        offer.signature = signature;

        await placeBid(nft.tokenAddress, nft.tokenId, {
          amount: data.amount,
          currency: data.currency,
          typedData: offer,
        });
        await fetchNFT();
        showSnackbar({
          severity: "success",
          message: "You bid has been placed.",
        });
      }
      setOfferType("");
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const onCancelBid = async (bid) => {
    try {
      await confirm({
        title: "Are you sure to remove your bid?",
        text: "The action cannot be reverted",
      });
      setLoading(true);
      await removeBid(bid.id);
      await fetchNFT();
      showSnackbar({
        severity: "success",
        message: "The bid has been cancelled.",
      });
    } catch (err) {
      console.error(err);
      showSnackbar({
        severity: "error",
        message: "Failed to cancel the bid",
      });
    }
    setLoading(false);
  };

  const onBurn = async () => {
    if (wrongNetwork) {
      showWrongNetworkWarning();
      return;
    }

    await confirm({
      title: "Are you sure to burn your NFT?",
      text: "The action cannot be reverted",
    });
    setLoading(true);

    try {
      if (nft.minted) {
        await erc721Contract.methods
          .burn(nft.tokenId)
          .send({ from: user.pubKey });
      } else {
        await burnNFT(nft.tokenAddress, nft.tokenId);
      }
      history.push("/");
    } catch (err) {
      console.error(err);
      showSnackbar({
        severity: "error",
        message: "Failed to burn the nft",
      });
    }
    setLoading(false);
  };

  const onTransfer = async (address) => {
    if (!Web3.utils.isAddress(address)) {
      return showSnackbar({
        severity: "error",
        message: "Invalid wallet address",
      });
    }

    await confirm({
      title: "Are you sure to transfer your bid?",
      text: "The action cannot be reverted",
    });

    if (wrongNetwork) {
      showWrongNetworkWarning();
      return;
    }
    setLoading(true);

    try {
      await erc721Contract.methods
        .transferFrom(user.pubKey, address, nft.tokenId)
        .send({ from: user.pubKey });
      await wait(20);
      await fetchNFT();
      showSnackbar({
        severity: "success",
        message: "The nft has been transfered.",
      });
    } catch (err) {
      console.error(err);
      showSnackbar({
        severity: "error",
        message: "Failed to transfer the nft.",
      });
    }
    setLoading(false);
  };

  const approveNFT = async () => {
    const marketplaceApproved = await erc721Contract.methods
      .isApprovedForAll(user.pubKey, selectedMarketAddress)
      .call();

    if (!marketplaceApproved) {
      await confirm({
        title: "APPROVE MARKETPLACE",
        text: "One-time Approval for further transactions",
        cancelText: "",
        okText: "Approve",
      });

      await erc721Contract.methods
        .setApprovalForAll(selectedMarketAddress, true)
        .send({ from: user.pubKey });
    }
  };

  const onAcceptBid = async (bid) => {
    if (wrongNetwork) {
      showWrongNetworkWarning();
      return;
    }

    await approveNFT();

    await confirm({
      title: "Are you sure to accept the bid?",
      text: "The action cannot be reverted once your nft is transfered",
    });

    const bidderBalance = await getErc20Balance(
      bid.currency,
      bid.bidder.pubKey
    );

    if (+bidderBalance < +bid.amount) {
      return showSnackbar({
        severity: "error",
        message: "Sorry, the bidder doest not have enough balance right now.",
      });
    }

    setLoading(true);

    try {
      if (nft.minted) {
        const marketContract = isZunaNFT ? contracts.market : contracts.market2;
        await marketContract.methods
          .acceptOffer(user.pubKey, bid.typedData)
          .estimateGas({ from: user.pubKey });
        await marketContract.methods
          .acceptOffer(user.pubKey, bid.typedData)
          .send({ from: user.pubKey });
      } else {
        await contracts.media.methods
          .lazyAcceptOfferMint(
            nft.tokenId,
            {
              tokenId: nft.tokenId,
              royaltyFee: nft.royaltyFee,
              collectionId: nft.collectionId || 0,
              tokenUri: nft.tokenUri,
              signature: nft.signature,
            },
            bid.typedData
          )
          .send({ from: user.pubKey });
      }
      await wait(20);
      showSnackbar({
        severity: "success",
        message: "The nft has been sold successfully.",
      });
    } catch (err) {
      console.error(err);
      showSnackbar({
        severity: "error",
        message: "Failed to accept the offer",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNFT();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenAddress, tokenId]);

  return (
    <Container maxWidth="xl">
      <OverlayLoading show={loading} />
      {nft && (
        <Meta
          title={nft.name}
          description={nft.description}
          url={`${window.location.origin}/items/${nft.id}`}
          image={nft.thumbnail}
        />
      )}
      {nft && (
        <Grid py={6} container spacing={5}>
          <Grid item xs={12} md={6}>
            <img
              src={nft.thumbnail || EmptyNft}
              alt=""
              width="100%"
              height="auto"
              style={{ borderRadius: 16 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography color="primary" variant="h4" fontWeight="bold">
              {nft.name}
            </Typography>
            <NFTInfo
              nft={nft}
              isMine={isMine}
              favorites={favorites}
              favorited={favorited}
              onFavorite={favorite}
              onUpdate={updateSale}
              onRemoveSale={removeSale}
              onTransfer={onTransfer}
              onBurn={onBurn}
            />
            <Box mt={5} mb={6}>
              {!isMine && (
                <Grid container spacing={3} justifyContent="flex-end">
                  {nft.currentAsk && (
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        fullWidth
                        onClick={() => setOfferType("buy")}
                      >
                        BUY NOW
                      </Button>
                    </Grid>
                  )}
                  {(nft.onSale || nft.currentAsk) && (
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => setOfferType("bid")}
                        fullWidth
                      >
                        PLACE A BID
                      </Button>
                    </Grid>
                  )}
                  {!!offerType && (
                    <OfferDialog
                      buying={offerType === "buy"}
                      nft={nft}
                      onClose={() => setOfferType("")}
                      onSubmit={handleOffer}
                    />
                  )}
                </Grid>
              )}
            </Box>

            <NFTHistory
              nft={nft}
              bids={bids}
              currentUser={user}
              cancelBid={onCancelBid}
              acceptBid={onAcceptBid}
            />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default NFTDetailComponent;
