import { useEffect, useState, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import Web3 from "web3";
import { Box, Button, Container, Grid, Typography } from "@mui/material";

import { useSnackbar } from "../contexts/Snackbar";
import {
  burnNFT,
  favoriteNft,
  getNft,
  getNftActivities,
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
import { getCurrencyDecimals, sameAddress, toWei } from "../helper/utils";
import OfferDialog from "../Components/common/OfferDialog";
import { config } from "../config";
import { useConfirm } from "../contexts/Confirm";
import Meta from "../Components/common/Meta";

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

const NFTDetailComponent = () => {
  const { user } = useAuthContext();
  const {
    wrongNetwork,
    showWrongNetworkWarning,
    signEIP712,
    contracts,
    getErc20Contract,
    getErc20Balance,
  } = useWeb3();
  const [nft, setNft] = useState();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [activities, setActivities] = useState([]);
  const [bids, setBids] = useState([]);
  const [offerType, setOfferType] = useState("");
  const confirm = useConfirm();
  const history = useHistory();
  const [favorites, setFavorites] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const { approveMarket } = useWeb3();

  const favorite = async () => {
    if (!user) {
      showSnackbar({
        severity: "warning",
        message: "You should loggin first.",
      });
      return;
    }
    await favoriteNft(nft.id);
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
        getNft(id),
        getNftActivities(id),
        getNftBids(id),
      ]);
      setNft(res[0]);
      setActivities(res[1]);
      setBids(res[2]);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load the nft");
    }
    setLoading(false);
  };

  const removeSale = async () => {
    setLoading(true);

    try {
      await removeNFTSale(nft.id);
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
      const marketplaceApproved = await contracts.media.methods
        .isApprovedForAll(user.pubKey, config.marketContractAddress)
        .call();

      if (!marketplaceApproved) {
        await confirm({
          title: "APPROVE MARKETPLACE",
          text: "One-time Approval for further transactions",
          cancelText: "",
          okText: "Approve",
        });

        await contracts.media.methods
          .setApprovalForAll(config.marketContractAddress, true)
          .send({ from: user.pubKey });
      }
      approveMarket(data.price.currency);
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

        const signature = await signEIP712(types, listing, "market");

        if (!signature) {
          throw new Error("Signature Required");
        }
        listing.signature = signature;

        await updateNFTSale(nft.id, {
          ...data,
          typedData: listing,
        });
      } else {
        await updateNFTSale(nft.id, data);
      }
      await fetchNFT();
    } catch (err) {
      console.error(err);
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
      const erc20 = getErc20Contract(
        buying ? nft.currentAsk.currency : data.currency
      );
      const allowance = await erc20.methods
        .allowance(user.pubKey, config.marketContractAddress)
        .call();

      if (+allowance < +amount) {
        await erc20.methods
          .approve(
            config.marketContractAddress,
            "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
          )
          .send({ from: user.pubKey });
      }

      if (buying) {
        if (nft.minted) {
          await contracts.market.methods
            .buy(user.pubKey, nft.currentAsk.typedData)
            .estimateGas({ from: user.pubKey });
          await contracts.market.methods
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
            .estimateGas({ from: user.pubKey });
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
        setTimeout(() => fetchNFT(), 3000);
      } else {
        const offer = {
          tokenId: nft.tokenId,
          erc20Address: data.currency,
          amount,
          createdAt: Date.now().toString(),
        };
        offer.signature = await signEIP712(types, offer, "market");
        await placeBid(nft.id, {
          amount: data.amount,
          currency: data.currency,
          typedData: offer,
        });
        fetchNFT();
      }
      setOfferType("");
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const onCancelBid = async (bid) => {
    await confirm({
      title: "Are you sure to remove your bid?",
      text: "The action cannot be reverted",
    });
    await removeBid(bid.id);
    await fetchNFT();
  };

  const onBurn = async () => {
    await confirm({
      title: "Are you sure to burn your NFT?",
      text: "The action cannot be reverted",
    });
    if (wrongNetwork) {
      showWrongNetworkWarning();
      return;
    }
    setLoading(true);

    try {
      if (nft.minted) {
        await contracts.media.methods
          .burn(nft.tokenId)
          .send({ from: user.pubKey });
      } else {
        await burnNFT(nft.id);
      }

      history.push("/");
    } catch (err) {
      console.error(err);
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
      await contracts.media.methods
        .transferFrom(user.pubKey, address, nft.tokenId)
        .send({ from: user.pubKey });
      fetchNFT();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const onAcceptBid = async (bid) => {
    if (wrongNetwork) {
      showWrongNetworkWarning();
      return;
    }

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
        message: "Sorry, the bidder doest not have enough balance at this time",
      });
    }

    setLoading(true);

    try {
      if (nft.minted) {
        await contracts.market.methods
          .acceptOffer(user.pubKey, bid.typedData)
          .estimateGas({ from: user.pubKey });
        await contracts.market.methods
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
      setTimeout(() => fetchNFT(), 3000);
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
  }, [id]);

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
              src={nft.thumbnail}
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
              activities={activities}
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
