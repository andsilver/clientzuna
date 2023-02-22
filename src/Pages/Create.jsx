import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useHistory } from "react-router-dom";

import { createNFT, createTempNFT, filterCollections } from "../api/api";
import OverlayLoading from "../Components/common/OverlayLoading";
import Switch from "../Components/common/Switch";
import { useAuthContext } from "../contexts/AuthContext";
import { useWeb3 } from "../contexts/Web3Context";
import { generateRandomTokenId } from "../helper/utils";
import { config } from "../config";
import { useSnackbar } from "../contexts/Snackbar";
import TopBanner from "../Components/common/TopBanner";

const categories = [...config.categories];

const DropZone = styled("div")(({ theme }) => ({
  border: "2px dashed #56566a",
  borderRadius: 16,
  padding: "45px 1.25rem",
  textAlign: "center",
  marginTop: 24,
  background: theme.palette.mode === "light" ? "#f8f8f8" : "#27273a",
}));

const LabelField = styled(Typography)({
  fontWeight: "bold",
  marginTop: 24,
  marginBottom: 12,
  fontSize: 16,
});

export default function Create() {
  const history = useHistory();
  const { user } = useAuthContext();
  const { wrongNetwork, signEIP712, approveNFT } = useWeb3();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState();
  const [nftDetails, setNftDetails] = useState({
    category: categories[0],
    name: "",
    description: "",
    royalties: "",
    collectionId: 0,
    properties: [
      {
        name: "",
        value: "",
      },
    ],
  });
  const [onSale, setOnSale] = useState(false);
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState([]);

  const { showSnackbar } = useSnackbar();

  const onDrop = useCallback((acceptedFiles) => {
    const [file] = acceptedFiles;
    setFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/jpg": [],
    },
    useFsAccessApi: false,
    multiple: false,
  });

  const onChangeNftDetails = (e) => {
    setNftDetails((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const updateProperty = (index, field, value) => {
    const properties = nftDetails.properties;
    properties[index][field] = value;

    setNftDetails({
      ...nftDetails,
      properties,
    });
  };

  const removeProperty = (index) => {
    const properties = [...nftDetails.properties];
    properties.splice(index, 1);
    setNftDetails({
      ...nftDetails,
      properties,
    });
  };

  const create = async () => {
    if (!user) {
      return showSnackbar({
        severity: "warning",
        message: `Please sign in to continue`,
      });
    }

    if (wrongNetwork) {
      showSnackbar({
        severity: "warning",
        message: `Wrong Network. Please switch to ${config.networkName}`,
      });
      return;
    }

    if (!file || !nftDetails.name || !nftDetails.description) {
      showSnackbar({
        severity: "error",
        message: "Please fill all required fields",
      });
      return;
    }

    try {
      if (onSale) {
        await approveNFT(
          config.nftContractAddress,
          config.marketContractAddress
        );
      }

      setLoading(true);

      const tokenId = generateRandomTokenId();
      const royaltyFee = nftDetails.royalties * 1000;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("tokenId", tokenId);
      formData.append("name", nftDetails.name);
      formData.append("description", nftDetails.description);
      formData.append("category", nftDetails.category);
      formData.append(
        "properties",
        JSON.stringify(nftDetails.properties.filter((p) => p.name && p.value))
      );
      formData.append("royaltyFee", royaltyFee);
      nftDetails.collectionId &&
        formData.append("collectionId", nftDetails.collectionId);
      formData.append("onSale", onSale);

      const { tokenUri, id: tempNftId } = await createTempNFT(formData);

      const voucher = {
        tokenId,
        royaltyFee,
        collectionId: nftDetails.collectionId,
        tokenUri,
      };

      const types = {
        NFTVoucher: [
          {
            name: "tokenId",
            type: "uint256",
          },
          {
            name: "royaltyFee",
            type: "uint256",
          },
          {
            name: "collectionId",
            type: "uint256",
          },
          {
            name: "tokenUri",
            type: "string",
          },
        ],
      };
      const signature = await signEIP712(types, voucher);

      const data = await createNFT({
        tokenId,
        signature,
        tempNftId,
      });
      history.push(`/items/${data.tokenAddress}/${data.tokenId}`);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    const objUrl = URL.createObjectURL(file);
    setPreview(objUrl);
  }, [file]);

  useEffect(() => {
    if (!user) {
      return;
    }
    filterCollections({
      owner: user.pubKey,
    }).then(setCollections);
  }, [user]);

  return (
    <div style={{ marginTop: -80 }}>
      {loading && <OverlayLoading show={loading} />}
      <TopBanner>
        <Typography
          variant="h3"
          fontWeight="bold"
          color="white"
          textAlign="center"
        >
          Create Single Collectible Item
        </Typography>
      </TopBanner>
      <Container maxWidth="xl">
        <Box py={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <Card sx={{ minHeight: 300 }}>
                <CardContent>
                  <Typography
                    color="primary"
                    textAlign="center"
                    fontSize={20}
                    fontWeight={600}
                  >
                    Preview
                  </Typography>
                  {preview && (
                    <img
                      style={{ width: "100%", borderRadius: 8 }}
                      src={preview}
                      alt=""
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={7}>
              <LabelField color="primary" marginTop={0}>
                Upload File *
              </LabelField>
              <DropZone
                {...getRootProps()}
                onClick={(e) => e.stopPropagation()}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the images here ...</p>
                ) : (
                  <div>
                    <Typography color="primary" mb={3}>
                      "PNG, GIF, WEBP, MP4 or MP3. Max 30mb."
                    </Typography>
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={open}
                    >
                      Choose File
                    </Button>
                  </div>
                )}
              </DropZone>
              <LabelField color="primary">Category</LabelField>
              <Select
                value={nftDetails.category}
                fullWidth
                color="secondary"
                name="category"
                onChange={onChangeNftDetails}
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
              <LabelField color="primary">Item Name</LabelField>
              <TextField
                name="name"
                color="secondary"
                variant="outlined"
                fullWidth
                placeholder="e.g. 'Music name or Art name'"
                value={nftDetails.name}
                onChange={onChangeNftDetails}
              />
              <LabelField color="primary">Description</LabelField>
              <TextField
                name="description"
                fullWidth
                multiline
                rows={4}
                placeholder="e.g. 'Music covert art for My Single'"
                color="secondary"
                variant="outlined"
                value={nftDetails.description}
                onChange={onChangeNftDetails}
              />
              <LabelField color="primary">Royalties</LabelField>
              <TextField
                name="royalties"
                color="secondary"
                variant="outlined"
                fullWidth
                type="number"
                placeholder="Suggested: 10%, 20%, 30%"
                value={nftDetails.royalties}
                onChange={onChangeNftDetails}
              />
              <LabelField color="primary">Collection</LabelField>
              <Select
                value={nftDetails.collectionId}
                fullWidth
                color="secondary"
                name="collectionId"
                onChange={onChangeNftDetails}
              >
                <MenuItem value={0}>No Collection</MenuItem>
                {collections.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    <Grid container alignItems="center">
                      <Avatar sx={{ width: 30, height: 30 }} src={c.image} />
                      <Typography ml={1} fontSize={12} fontWeight="bold">
                        {c.name}
                      </Typography>
                    </Grid>
                  </MenuItem>
                ))}
              </Select>
              <LabelField color="primary">
                Properties
                <IconButton
                  size="small"
                  style={{ marginLeft: 12 }}
                  onClick={() =>
                    setNftDetails({
                      ...nftDetails,
                      properties: [
                        ...nftDetails.properties,
                        {
                          name: "",
                          value: "",
                        },
                      ],
                    })
                  }
                >
                  <AddIcon />
                </IconButton>
              </LabelField>
              {nftDetails.properties.map((p, index) => (
                <Grid
                  key={index}
                  container
                  spacing={2}
                  justifyContent="space-between"
                  mb={1}
                >
                  <Grid item xs={5}>
                    <TextField
                      color="secondary"
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="e.g. 'Size'"
                      value={p.name}
                      onChange={(e) =>
                        updateProperty(index, "name", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      color="secondary"
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="e.g. 'M'"
                      value={p.value}
                      onChange={(e) =>
                        updateProperty(index, "value", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item>
                    <IconButton onClick={() => removeProperty(index)}>
                      <CloseIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                mt={3}
                mb={4}
              >
                <Grid item>
                  <Typography color="primary" fontWeight="bold">
                    Put on sale
                  </Typography>
                  <Typography color="primary" variant="subtitle2">
                    You'll receive bids on this item
                  </Typography>
                </Grid>
                <Grid item>
                  <Switch value={onSale} onChange={(e, v) => setOnSale(v)} />
                </Grid>
              </Grid>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                size="large"
                onClick={create}
              >
                Create
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
}
