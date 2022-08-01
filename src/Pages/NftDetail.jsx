import { useEffect, useState, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";

import { useSnackbar } from "../contexts/Snackbar";
import {
  burnNFT,
  getNft,
  getNftActivities,
  getNftBids,
  placeBid,
  removeBid,
  removeNFTSale,
  updateNFTSale,
} from "../api/api";
import OverlayLoading from "../Components/common/OverlayLoading";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import NFTInfo from "../Components/NFTDetail/NFTInfo";
import NFTHistory from "../Components/NFTDetail/NFTHistory";
import { useAuthContext } from "../contexts/AuthContext";
import { useWeb3 } from "../contexts/Web3Context";
import { sameAddress } from "../helper/utils";
import Web3 from "web3";
import OfferDialog from "../Components/common/OfferDialog";
import { config } from "../config";
import { useConfirm } from "../contexts/Confirm";

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

    setLoading(true);

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
    }

    try {
      if (data.instantSale) {
        const listing = {
          tokenId: nft.tokenId,
          erc20Address: data.price.currency,
          amount: Web3.utils.toWei(data.price.amount),
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
      const amount = buying
        ? nft.currentAsk.typedData.amount
        : Web3.utils.toWei(data.amount);
      const erc20 = getErc20Contract(
        buying ? nft.currentAsk.currency : data.currency
      );
      const allowance = await erc20.methods
        .allowance(user.pubKey, config.marketContractAddress)
        .call();

      if (allowance < amount) {
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
    <Container maxWidth="lg">
      <OverlayLoading show={loading} />
      {nft && (
        <Grid py={4} container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card
              style={{
                minHeight: 200,
                maxWidth: 400,
                filter: "drop-shadow(rgba(0,0,0,0.25) 0px 20px 20px)",
              }}
            >
              <img
                src={nft.image}
                alt=""
                width="100%"
                height="auto"
                style={{ borderRadius: 16 }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography color="primary" variant="h4" fontWeight="bold">
              {nft.name}
            </Typography>
            <NFTInfo
              nft={nft}
              isMine={isMine}
              onUpdate={updateSale}
              onRemoveSale={removeSale}
              onTransfer={onTransfer}
              onBurn={onBurn}
            />
            <NFTHistory
              nft={nft}
              activities={activities}
              bids={bids}
              currentUser={user}
              cancelBid={onCancelBid}
              acceptBid={onAcceptBid}
            />
            <Box mt={5}>
              {!isMine && (
                <>
                  {nft.currentAsk && (
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      style={{ borderRadius: 6, marginRight: 12 }}
                      onClick={() => setOfferType("buy")}
                    >
                      BUY NOW
                    </Button>
                  )}
                  {(nft.onSale || nft.currentAsk) && (
                    <Button
                      color="secondary"
                      variant="outlined"
                      size="large"
                      style={{ borderRadius: 6 }}
                      onClick={() => setOfferType("bid")}
                    >
                      PLACE A BID
                    </Button>
                  )}
                  <OfferDialog
                    open={!!offerType}
                    buying={offerType === "buy"}
                    nft={nft}
                    onClose={() => setOfferType("")}
                    onSubmit={handleOffer}
                  />
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      )}
      <Divider />
    </Container>
  );
};

export default NFTDetailComponent;
