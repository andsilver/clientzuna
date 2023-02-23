import { Button, FormControlLabel, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { addStreamEvent, filterNfts } from "../../api/api";
import { config } from "../../config";
import { useAuthContext } from "../../contexts/AuthContext";
import { useSnackbar } from "../../contexts/Snackbar";
import { useWeb3 } from "../../contexts/Web3Context";
import { convertTxReceipt, sameAddress, wait } from "../../helper/utils";
import useLoading from "../../hooks/useLoading";
import useNftFilterQuery from "../../hooks/useNftFilterQuery";
import NftList from "../common/NftList";
import OverlayLoading from "../common/OverlayLoading";
import Switch from "../common/Switch";
import ExplorerFilter from "../Explorer/Filter";

export default function NftsCollected({ userAddress }) {
  const [nfts, setNfts] = useState([]);
  const { loading, sendRequest } = useLoading();
  const [allLoaded, setAllLoaded] = useState(false);
  const [count, setCount] = useState(0);
  const query = useNftFilterQuery();
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [selected, setSelected] = useState([]);
  const { mediaContract } = useWeb3();
  const { showSnackbar } = useSnackbar();
  const [loadingBurn, setLoadingBurn] = useState(false);
  const { user } = useAuthContext();

  const isOwner = sameAddress(user?.pubKey, userAddress);

  const fetchNfts = async (init) => {
    const { count, result } = await sendRequest(() =>
      filterNfts({
        ...query,
        offset: init ? 0 : nfts.length,
        userAddress,
      })
    );

    if (result) {
      setNfts(init ? result : [...nfts, ...result]);
      setAllLoaded(result.length < config.defaultPageSize);
      setCount(count);
    }
  };

  useEffect(() => {
    fetchNfts(true);

    if (isOwner) {
      setSelected([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleChange = (e) => {
    setShowCheckbox(e.target.checked);
  };

  const handleSelectChange = (e, nft) => {
    const id = nft.tokenAddress + nft.tokenId;

    if (e.target.checked) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter((i) => i !== id));
    }
  };

  const selectAll = () => {
    setSelected(nfts.map((n) => n.tokenAddress + n.tokenId));
  };

  const unselectAll = () => {
    setSelected([]);
  };

  const burn = async () => {
    setLoadingBurn(true);

    try {
      const ids = selected
        .filter((id) =>
          id.toLowerCase().includes(config.nftContractAddress.toLowerCase())
        )
        .map((id) => id.replace(config.nftContractAddress.toLowerCase(), ""));
      const res = await mediaContract.bulkBurn(ids);
      const receipt = await res.wait();
      const { block, logs } = convertTxReceipt(receipt);
      await addStreamEvent(block, logs);
      await wait(10);

      showSnackbar({
        severity: "success",
        message:
          "Nfts are burned. They won't be shown in the marketplace after some time",
      });
      fetchNfts(true);
      setSelected([]);
    } catch (err) {
      console.error(err);
      showSnackbar({
        severity: "error",
        message: "An error happend in the bulk burn",
      });
    }
    setLoadingBurn(false);
  };

  return (
    <>
      {loadingBurn && <OverlayLoading show />}
      {isOwner && (
        <Grid
          container
          justifyContent="flex-end"
          mb={2}
          alignItems="center"
          spacing={2}
        >
          {showCheckbox && selected.length > 0 && (
            <Grid item>
              <Button variant="contained" color="error" onClick={burn}>
                Burn
              </Button>
            </Grid>
          )}
          {showCheckbox && selected.length > 0 && (
            <Grid item>
              <Button variant="outlined" color="primary" onClick={unselectAll}>
                Unselect All
              </Button>
            </Grid>
          )}
          {showCheckbox && (
            <Grid item>
              <Button variant="outlined" color="primary" onClick={selectAll}>
                Select All
              </Button>
            </Grid>
          )}
          <Grid item>
            <FormControlLabel
              labelPlacement="start"
              control={
                <Switch
                  sx={{ mx: 2 }}
                  checked={showCheckbox}
                  onChange={handleChange}
                />
              }
              label={<Typography color="primary">Show Checkbox</Typography>}
              color="primary"
            />
          </Grid>
        </Grid>
      )}
      <ExplorerFilter />
      <NftList
        showCheckbox={showCheckbox}
        selected={selected}
        nfts={nfts}
        loading={loading}
        allLoaded={allLoaded}
        loadMore={() => fetchNfts(false)}
        count={count}
        onCheckedChange={handleSelectChange}
      />
    </>
  );
}
