import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

import {
  createNFT,
  filterCollections,
  pinImageToIPFS,
  pinJsonToIPFS,
} from "../api/api";
import OverlayLoading from "../Components/common/OverlayLoading";
import Switch from "../Components/common/Switch";
import UserBanner from "../Components/Create/UserBanner";
import UserProfile from "../Components/Create/UserProfile";
import { useAuthContext } from "../contexts/AuthContext";
import { useWeb3 } from "../contexts/Web3Context";
import { generateRandomTokenId } from "../helper/utils";
import { useHistory } from "react-router-dom";
import { useConfirm } from "../contexts/Confirm";
import { config } from "../config";
import { useSnackbar } from "../contexts/Snackbar";

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
});

export default function Create() {
  const history = useHistory();
  const { user, connect } = useAuthContext();
  const { wrongNetwork, signEIP712, contracts } = useWeb3();
  const {
    palette: { mode },
  } = useTheme();
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

  const confirm = useConfirm();
  const { showSnackbar } = useSnackbar();

  const onDrop = useCallback((acceptedFiles) => {
    const [file] = acceptedFiles;
    setFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png, image/jpg, image/gif",
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
    if (wrongNetwork) {
      showSnackbar({
        severity: "error",
        message: `Wrong Network. Please switch to ${config.networkName}`,
      });
      return;
    }

    if (!user) {
      connect();
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

          setLoading(true);

          await contracts.media.methods
            .setApprovalForAll(config.marketContractAddress, true)
            .send({ from: user.pubKey });
        }
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const { IpfsHash } = await pinImageToIPFS(formData);

      const metadata = {
        name: nftDetails.name,
        description: nftDetails.description,
        category: nftDetails.category,
        image: `ipfs://${IpfsHash}`,
        properties: nftDetails.properties.filter((p) => p.name && p.value),
      };

      const { IpfsHash: metadataHash } = await pinJsonToIPFS(metadata);

      const voucher = {
        tokenId: generateRandomTokenId(),
        royaltyFee: nftDetails.royalties * 1000,
        collectionId: nftDetails.collectionId,
        tokenUri: `ipfs://${metadataHash}`,
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
        ...metadata,
        ...voucher,
        signature,
        onSale,
      });
      history.push(`/items/${data.id}`);
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
    <>
      {loading && <OverlayLoading show={loading} />}
      <UserBanner user={user} />
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <UserProfile user={user} mode={mode} />
          </Grid>
          <Grid item xs={12} md={9}>
            <Box py={3}>
              <Typography variant="h5" fontWeight="bold" color="primary" mb={2}>
                Create Single Collectible Item
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                  <Card>
                    <CardContent>
                      <LabelField>Upload File *</LabelField>
                      <DropZone
                        {...getRootProps()}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                          <p>Drop the images here ...</p>
                        ) : (
                          <div>
                            <Typography mb={3}>
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
                      <LabelField>Category</LabelField>
                      <Select
                        value={nftDetails.category}
                        size="small"
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
                      <LabelField>Item Name</LabelField>
                      <TextField
                        name="name"
                        color="secondary"
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="e.g. 'Music name or Art name'"
                        value={nftDetails.name}
                        onChange={onChangeNftDetails}
                      />
                      <LabelField>Description</LabelField>
                      <TextField
                        name="description"
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="e.g. 'Music covert art for My Single'"
                        color="secondary"
                        variant="outlined"
                        size="small"
                        value={nftDetails.description}
                        onChange={onChangeNftDetails}
                      />
                      <LabelField>Royalties</LabelField>
                      <TextField
                        name="royalties"
                        color="secondary"
                        variant="outlined"
                        size="small"
                        fullWidth
                        type="number"
                        placeholder="Suggested: 10%, 20%, 30%"
                        value={nftDetails.royalties}
                        onChange={onChangeNftDetails}
                      />
                      <LabelField>Collection</LabelField>
                      <Select
                        value={nftDetails.collectionId}
                        size="small"
                        fullWidth
                        color="secondary"
                        name="collectionId"
                        onChange={onChangeNftDetails}
                      >
                        <MenuItem value={0}>No Collection</MenuItem>
                        {collections.map((c) => (
                          <MenuItem key={c.id} value={c.id}>
                            <Grid container alignItems="center">
                              <Avatar
                                sx={{ width: 30, height: 30 }}
                                src={c.image}
                              />
                              <Typography
                                ml={1}
                                fontSize={12}
                                fontWeight="bold"
                              >
                                {c.name}
                              </Typography>
                            </Grid>
                          </MenuItem>
                        ))}
                      </Select>
                      <LabelField>
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
                      >
                        <Grid item>
                          <Typography fontWeight="bold">Put on sale</Typography>
                          <Typography variant="subtitle2">
                            You'll receive bids on this item
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Switch
                            value={onSale}
                            onChange={(e, v) => setOnSale(v)}
                          />
                        </Grid>
                      </Grid>

                      {/* <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                    mt={3}
                  >
                    <Grid item>
                      <Typography fontWeight="bold">
                        Instant sale price
                      </Typography>
                      <Typography variant="subtitle2">
                        Enter the price for which the item will be instantly
                        sold
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Switch
                        value={!!instantSale}
                        onChange={(e, v) => instantSale(v ? {} : null)}
                      />
                    </Grid>
                  </Grid>

                  {salePrice && (
                    <Grid mt={1} container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          color="secondary"
                          variant="outlined"
                          size="small"
                          fullWidth
                          placeholder="Enter price"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Select size="small" fullWidth color="secondary">
                          <MenuItem>WBNB</MenuItem>
                        </Select>
                      </Grid>
                    </Grid>
                  )} */}
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={create}
                      >
                        Create
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Card>
                    <CardContent>
                      <LabelField textAlign="center">Preview</LabelField>
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
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
