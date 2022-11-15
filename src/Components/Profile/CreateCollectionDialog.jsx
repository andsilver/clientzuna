import {
  Button,
  DialogContent,
  Grid,
  MenuItem,
  Select,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { createCollection, updateCollection } from "../../api/api";
import { config } from "../../config";
import { useSnackbar } from "../../contexts/Snackbar";
import { StyledDialog, StyledDialogTitle } from "../common/DialogElements";
import OverlayLoading from "../common/OverlayLoading";
import ImageUploader from "../ImageUploader";

const LabelField = styled(Typography)({
  fontWeight: "bold",
  marginTop: 16,
  marginBottom: 12,
});

const DummyImage =
  "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTAwcHgiIGhlaWdodD0iMTAwcHgiIHZpZXdCb3g9IjAgMCA4MCA4MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIiBpZD0iOTUyNTU5NzY1MzY2Ij4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0icmdiKDI1NSwgMCwgMTE1KSIgb2Zmc2V0PSIwJSI+PC9zdG9wPgogICAgICA8c3RvcCBzdG9wLWNvbG9yPSJyZ2IoMTE1LCAyNTUsIDApIiBvZmZzZXQ9IjEwMCUiPjwvc3RvcD4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxnIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgPHJlY3QgaWQ9IlJlY3RhbmdsZSIgZmlsbD0idXJsKCM5NTI1NTk3NjUzNjYpIiB4PSIwIiB5PSIwIiB3aWR0aD0iODAiIGhlaWdodD0iODAiPjwvcmVjdD4KICA8L2c+Cjwvc3ZnPg==";

const CATEGORIES = [...config.categories].filter((c) => c !== "ZunaNauts");

export default function CreateCollectionDialog({
  onClose,
  onCreate,
  collectionData,
}) {
  const [imageFile, setImageFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const { showSnackbar } = useSnackbar();
  const [collection, setCollection] = useState({
    name: collectionData?.name || "",
    banner: collectionData?.banner || "",
    description: collectionData?.description || "",
    image: collectionData?.image || "",
    twitter: collectionData?.twitter || "",
    instagram: collectionData?.instagram || "",
    category: collectionData?.category || "",
  });
  const [loading, setLoading] = useState(false);
  const editing = !!collectionData;

  const handleCreate = async () => {
    if (
      !collection.name ||
      !collection.description ||
      !collection.image ||
      !collection.banner
    ) {
      showSnackbar({
        severity: "error",
        message: "Please fill all required fields",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(collection).forEach(([key, value]) => {
        if (value && !["banner", "image"].includes(key)) {
          formData.append(key, value);
        }
      });

      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (bannerFile) {
        formData.append("banner", bannerFile);
      }

      if (editing) {
        await updateCollection(collectionData.id, formData);
      } else {
        await createCollection(formData);
      }

      showSnackbar({
        severity: "success",
        message: `Successfully ${editing ? "updated" : "created"} a collection`,
      });
      onCreate();
    } catch (err) {
      console.error(err);
      showSnackbar({
        severity: "error",
        message: `Failed to ${editing ? "updated" : "created"} a collection`,
      });
    }
    setLoading(false);
  };

  const onChange = (e) => {
    setCollection((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  return (
    <StyledDialog onClose={onClose} open>
      <OverlayLoading show={loading} />
      <StyledDialogTitle onClose={onClose}>
        <Typography color="primary" fontWeight="bold">
          {`${editing ? "Edit" : "Create"}`} a collection
        </Typography>
      </StyledDialogTitle>
      <DialogContent>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <img
              style={{
                borderRadius: 12,
                width: 100,
                height: 100,
              }}
              src={collection.image || DummyImage}
              alt=""
            />
          </Grid>
          <Grid item>
            <Typography fontSize={13} maxWidth={300} mb={2}>
              Recommended Image size Min. 400x400 Compatible with Gifs.
            </Typography>
            <ImageUploader
              gutter={0}
              title="Choose File"
              onChange={(f) => setImageFile(f)}
              setPreview={(url) => setCollection({ ...collection, image: url })}
            />
          </Grid>
        </Grid>
        <Grid container flexDirection="column" alignItems="center" my={3}>
          <div
            style={{
              borderRadius: 10,
              maxWidth: "100%",
              height: 100,
              width: "100%",
              backgroundImage: `url(${collection.banner || DummyImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <ImageUploader
            title="Upload Cover"
            onChange={(f) => setBannerFile(f)}
            setPreview={(url) => setCollection({ ...collection, banner: url })}
          />
          <Typography textAlign="center" variant="subtitle2" maxWidth={300}>
            Recommended Image size Min. 840x400 Compatible with Gifs./ supports
            Gifs
          </Typography>
        </Grid>
        <LabelField>Name *</LabelField>
        <TextField
          name="name"
          required
          fullWidth
          placeholder="Enter Collection Name"
          color="secondary"
          variant="outlined"
          size="small"
          value={collection.name}
          onChange={onChange}
        />
        <LabelField>Description *</LabelField>
        <TextField
          name="description"
          required
          fullWidth
          multiline
          rows={4}
          placeholder="Enter Collection Description"
          color="secondary"
          variant="outlined"
          size="small"
          value={collection.description}
          onChange={onChange}
        />
        <LabelField>Category</LabelField>
        <Select
          value={collection.category}
          fullWidth
          color="secondary"
          name="category"
          onChange={onChange}
          size="small"
        >
          {CATEGORIES.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
        <LabelField>Twitter</LabelField>
        <TextField
          name="twitter"
          color="secondary"
          variant="outlined"
          size="small"
          fullWidth
          value={collection.twitter}
          onChange={onChange}
          InputProps={{
            startAdornment: "@",
          }}
        />
        <LabelField>Instagram</LabelField>
        <TextField
          name="instagram"
          color="secondary"
          variant="outlined"
          size="small"
          fullWidth
          value={collection.instagram}
          onChange={onChange}
          InputProps={{
            startAdornment: "@",
          }}
        />
      </DialogContent>
      <Grid container pt={1} pb={2} justifyContent="center">
        <Button
          variant="contained"
          color="secondary"
          sx={{ minWidth: 120 }}
          onClick={() => handleCreate()}
        >
          {`${editing ? "Save" : "Create"}`}
        </Button>
      </Grid>
    </StyledDialog>
  );
}
