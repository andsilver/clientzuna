import {
  Button,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  MobileStepper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import DownloadIcon from "@mui/icons-material/Download";

import { StyledDialog, StyledDialogTitle } from "../common/DialogElements";
import FileUploadButton from "../common/FileUploaderButton";
import { useSnackbar } from "../../contexts/Snackbar";
import { config } from "../../config";
import NftPreviews from "./NftPreviews";
import {
  currencySymbolToAddress,
  generateRandomTokenId,
  getCurrencyDecimals,
  toWei,
} from "../../helper/utils";
import OverlayLoading from "../common/OverlayLoading";
import {
  downloadCsvFile,
  pinImagesToIPFS,
  pinJsonsToIPFS,
} from "../../api/api";
import { useWeb3 } from "../../contexts/Web3Context";
import { useAuthContext } from "../../contexts/AuthContext";

const STEP_LABLES = ["Upload Files", "Preview"];

export default function BulkMint({ onClose, collectionId }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [csv, setCsv] = useState(null);
  const [imageFiles, setImageFiles] = useState(null);
  const [imagePreviews, setImagePreviews] = useState(null);
  const { showSnackbar } = useSnackbar();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { address } = useAuthContext();
  const { wrongNetwork, contracts } = useWeb3();

  const mint = async () => {
    if (wrongNetwork) {
      return;
    }
    setLoading(true);

    let vouchers;

    const { media } = contracts;

    try {
      const formData = new FormData();

      for (const file of imageFiles) {
        formData.append("files", file);
      }
      const imagePins = await pinImagesToIPFS(formData);
      const jsonPins = await pinJsonsToIPFS(
        csv.map((nft, index) => ({
          name: nft.name,
          description: nft.description,
          category: nft.category,
          image: `ipfs://${imagePins[index].IpfsHash}`,
          properties: nft.properties,
        }))
      );
      vouchers = csv.map((nft, index) => ({
        tokenId: nft.tokenId,
        royaltyFee: `${+nft.royaltyFee * 1000}`,
        collectionId: `${collectionId}`,
        tokenUri: `ipfs://${jsonPins[index].IpfsHash}`,
        signature: [],
      }));
    } catch (err) {
      console.error(err);
      showSnackbar({
        severity: "error",
        message: "Failed to upload files on IPFS",
      });
      setLoading(false);
      return;
    }
    showSnackbar({
      severity: "info",
      message: "Uploaded files on IPFS.",
    });

    try {
      const tokenIds = csv.map((nft) => nft.tokenId);

      const offers = csv.map((nft) => {
        let amount = "0";

        if (+nft.amount) {
          const decimals = getCurrencyDecimals(nft.erc20Address);
          amount = toWei(`${nft.amount}`, decimals);
        }

        return {
          tokenId: nft.tokenId,
          erc20Address:
            nft.erc20Address || "0x0000000000000000000000000000000000000000",
          amount,
          createdAt: `${Date.now()}`,
          signature: [],
        };
      });
      await media.methods.bulkMint(tokenIds, vouchers, offers).send({
        from: address,
      });
      showSnackbar({
        severity: "success",
        message:
          "Successfully minted. Please wait for some time for the nfts appearing in the marketplace.",
      });
      onClose();
    } catch (err) {
      console.error(err);
      showSnackbar({
        severity: "error",
        message: "Failed to mint",
      });
    }
    setLoading(false);
  };

  const handleNext = () => {
    if (step === STEP_LABLES.length - 1) {
      mint();
      return;
    }
    setCurrentIndex(0);
    setStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (step === 0) {
      onClose();
      return;
    }
    setStep((prevActiveStep) => prevActiveStep - 1);
  };

  const downloadCsvTemplate = async () => {
    setLoading(true);

    try {
      const { data } = await downloadCsvFile();
      const href = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", "bulk-import.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    } catch (err) {
      console.error("File download error:\n", err);
    }
    setLoading(false);
  };

  const onAcceptCSV = (file) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const columnMapping = {
          Name: "name",
          Description: "description",
          Category: "category",
          Royalties: "royaltyFee",
          Properties: "properties",
          "ERC20 Name": "currency",
          "ERC20 Amount": "amount",
        };
        const nfts = results.data.filter(
          (nft) => nft["Name"] && nft["Name"].trim()
        );

        for (const nft of nfts) {
          Object.entries(columnMapping).forEach(([key, value]) => {
            nft[value] = nft[key].trim();
            delete nft[key];
          });

          if (!nft.name || !nft.description || !nft.category) {
            showSnackbar({
              severity: "error",
              message: "Name, Description and Category fields are required.",
            });
            setCsv(null);
            return;
          }

          if (isNaN(+nft.amount) || nft.amount < 0) {
            showSnackbar({
              severity: "error",
              message: "ERC20 Amount should be a vaild integer number.",
            });
            setCsv(null);
            return;
          }
          nft.amount = +nft.amount;

          if (nft.currency) {
            nft.currency = nft.currency.toUpperCase();

            if (!Object.keys(config.currencies).includes(nft.currency)) {
              showSnackbar({
                severity: "error",
                message: "ERC20 Name can be only WBNB or ZUNA",
              });
              setCsv(null);
              return;
            }
            nft.erc20Address = currencySymbolToAddress(nft.currency);
          }

          if (nft.properties) {
            nft.properties = nft.properties.split(",").map((p) => {
              const [pKey, pValue] = p.split(":");

              return {
                name: pKey?.trim(),
                value: pValue?.trim(),
              };
            });

            for (const p of nft.properties) {
              if (!p.name || !p.value) {
                showSnackbar({
                  severity: "error",
                  message: "Invalid properties.",
                });
                setCsv(null);
                return;
              }
            }
          } else {
            nft.properties = [];
          }
          nft.tokenId = generateRandomTokenId();
        }
        setCsv(nfts);
      },
      error: (err) => {
        console.error(err);
        setCsv(null);
        showSnackbar({
          severity: "error",
          message: "Failed to parse your csv file",
        });
      },
    });
  };

  const onAcceptImages = (files) => {
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    setImageFiles(files);
  };

  useEffect(() => {
    if (!csv || !imagePreviews) {
      return;
    }

    if (csv.length !== imagePreviews.length) {
      showSnackbar({
        severity: "error",
        message:
          "CSV records length is not matching to the number of image files",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [csv, imagePreviews]);

  const [disableNext, disablePrev] = useMemo(() => {
    let dNext = true,
      dPrev = true;

    switch (step) {
      case 0:
        if (
          csv &&
          imagePreviews &&
          imagePreviews.length &&
          imagePreviews.length === csv.length
        ) {
          dNext = false;
        }
        dPrev = false;
        break;
      case 1:
        dPrev = false;
        dNext = currentIndex !== csv.length - 1;
        break;
      default:
        break;
    }
    return [dNext, dPrev];
  }, [step, csv, imagePreviews, currentIndex]);

  const handleStepChange = (step) => {
    setCurrentIndex(step);
  };

  return (
    <StyledDialog keepMounted open fullScreen={fullScreen}>
      <StyledDialogTitle onClose={onClose}>
        {STEP_LABLES[step]}
      </StyledDialogTitle>
      <DialogContent>
        {loading && <OverlayLoading show />}
        {step === 0 && (
          <Grid
            container
            alignItems="center"
            flexDirection="column"
            sx={(t) => ({ [t.breakpoints.up("sm")]: { minWidth: 400 } })}
            spacing={2}
            px={4}
            py={2}
          >
            <Grid item>
              <FileUploadButton
                title={csv ? "Replace the CSV" : "Upload a CSV"}
                fileTypes={{ "text/csv": [".csv"] }}
                onChange={onAcceptCSV}
              />
            </Grid>
            <Grid item>
              <FileUploadButton
                title={imageFiles ? "Replace Images" : "Upload Images"}
                multiple
                onChange={onAcceptImages}
              />
            </Grid>
            <Grid item>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
              >
                <Grid item>
                  <Typography color="primary">
                    Not having a template? Download
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton onClick={downloadCsvTemplate}>
                    <DownloadIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        {step === 1 && (
          <NftPreviews
            currentIndex={currentIndex}
            handleStepChange={handleStepChange}
            nfts={csv}
            previews={imagePreviews}
          />
        )}
      </DialogContent>
      <Divider />
      {step === STEP_LABLES.length - 1 && (
        <MobileStepper
          variant="progress"
          steps={csv.length}
          position="static"
          activeStep={currentIndex}
          sx={{
            flexGrow: 1,
            background: "transparent",
          }}
          nextButton={
            <IconButton
              size="small"
              onClick={() => setCurrentIndex((i) => i + 1)}
              disabled={currentIndex === csv.length - 1}
            >
              <KeyboardArrowRight />
            </IconButton>
          }
          backButton={
            <IconButton
              size="small"
              onClick={() => setCurrentIndex((i) => i - 1)}
              disabled={currentIndex === 0}
            >
              <KeyboardArrowLeft />
            </IconButton>
          }
        />
      )}
      <Grid container spacing={1} p={1} py={2} justifyContent="flex-end">
        <Grid item>
          <Button
            variant="contained"
            onClick={handleBack}
            disabled={disablePrev}
            startIcon={
              step > 0 ? <KeyboardArrowLeft fontSize="small" /> : <></>
            }
          >
            {step > 0 ? "Back" : "Cancel"}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={disableNext}
            endIcon={
              step === STEP_LABLES.length - 1 ? (
                <></>
              ) : (
                <KeyboardArrowRight fontSize="small" />
              )
            }
          >
            {step === STEP_LABLES.length - 1 ? "Mint" : "Next"}
          </Button>
        </Grid>
      </Grid>
    </StyledDialog>
  );
}