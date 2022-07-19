import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";
import OverlayLoading from "../Components/common/OverlayLoading";
import UserBanner from "../Components/Create/UserBanner";
import UserProfile from "../Components/Create/UserProfile";
import { useAuthContext } from "../contexts/AuthContext";
import { useSnackbar } from "../contexts/Snackbar";
import DefaultUser from "../assets/default_user.png";
import DummyImage from "../assets/dummy-image.jpg";
import ImageUploader from "../Components/ImageUploader";
import { useEffect } from "react";
import { uploadToCloudinary } from "../helper/cloudinary";
import { updateUser } from "../api/api";

const LabelField = styled(Typography)({
  fontWeight: "bold",
  marginTop: 24,
  marginBottom: 12,
});

export default function Settings() {
  const { user, fetchUser } = useAuthContext();
  const [profile, setProfile] = useState();
  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const {
    palette: { mode },
  } = useTheme();

  const onChangeProfile = (e) => {
    setProfile((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const updateProfile = async () => {
    const data = { ...profile };

    setLoading(true);

    try {
      if (avatarFile) {
        data.avatar = (await uploadToCloudinary(avatarFile)).url;
      }

      if (bannerFile) {
        data.banner = (await uploadToCloudinary(bannerFile)).url;
      }
      await updateUser(user.pubKey, data);
      await fetchUser();
      setAvatarFile(null);
      setBannerFile(null);
      showSnackbar({
        severity: "success",
        message: "Successfully updated your profile",
      });
    } catch (err) {
      console.error(err);
      showSnackbar({
        severity: "error",
        message: "Failed to update your profile",
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    console.log(user);
    setProfile({
      name: user?.name || "",
      avatar: user?.avatar || "",
      banner: user?.banner || "",
      twitter: user?.twitter || "",
      instagram: user?.instagram || "",
      bio: user?.bio || "",
    });
  }, [user]);

  console.log(profile);

  return profile ? (
    <div>
      {loading && <OverlayLoading show={loading} />}
      <UserBanner user={user} />
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <UserProfile user={user} mode={mode} />
          </Grid>
          <Grid item xs={12} md={9} py={3} mt={3}>
            <Card>
              <CardContent>
                <LabelField>Profile Details</LabelField>
                <Grid container spacing={4}>
                  <Grid
                    xs={12}
                    md={6}
                    item
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <img
                      style={{
                        borderRadius: "50%",
                        width: 100,
                        height: 100,
                      }}
                      src={profile.avatar || DefaultUser}
                      alt=""
                    />
                    <ImageUploader
                      title="Upload Profile"
                      onChange={(f) => setAvatarFile(f)}
                      setPreview={(url) =>
                        setProfile({ ...profile, avatar: url })
                      }
                    />
                    <Typography
                      textAlign="center"
                      variant="subtitle2"
                      maxWidth={300}
                    >
                      Recommended Image size Min. 400x400 Compatible with Gifs./
                      supports Gifs
                    </Typography>
                  </Grid>
                  <Grid
                    xs={12}
                    md={6}
                    item
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <div
                      style={{
                        borderRadius: 10,
                        maxWidth: "100%",
                        height: 100,
                        width: 360,
                        backgroundImage: `url(${profile.banner || DummyImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                    <ImageUploader
                      title="Upload Cover"
                      onChange={(f) => setBannerFile(f)}
                      setPreview={(url) =>
                        setProfile({ ...profile, banner: url })
                      }
                    />
                    <Typography
                      textAlign="center"
                      variant="subtitle2"
                      maxWidth={300}
                    >
                      Recommended Image size Min. 840x400 Compatible with Gifs./
                      supports Gifs
                    </Typography>
                  </Grid>
                </Grid>
                <Grid mt={2} container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <LabelField>User Name</LabelField>
                    <TextField
                      name="name"
                      color="secondary"
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="Account Name"
                      value={profile.name}
                      onChange={onChangeProfile}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LabelField>Twitter Username</LabelField>
                    <TextField
                      name="twitter"
                      color="secondary"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={profile.twitter}
                      onChange={onChangeProfile}
                      InputProps={{
                        startAdornment: "@",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LabelField>Instagram URL</LabelField>
                    <TextField
                      name="instagram"
                      color="secondary"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={profile.instagram}
                      onChange={onChangeProfile}
                      InputProps={{
                        startAdornment: "https://",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LabelField>Bio</LabelField>
                    <TextField
                      name="bio"
                      color="secondary"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={profile.bio}
                      onChange={onChangeProfile}
                      multiline
                      rows={4}
                      placeholder="Tell about yourself in a few words"
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Grid container justifyContent="center" my={3}>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  sx={{ minWidth: 200 }}
                  onClick={updateProfile}
                >
                  Update
                </Button>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  ) : (
    <></>
  );
}
