import {
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Typography,
  Link as LinkE,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import PersonRemoveRoundedIcon from "@mui/icons-material/PersonRemoveRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { styled } from "@mui/system";

import Link from "../Link";
import DefaultUser from "../../assets/default_user.png";
import { copyText, minimizeAddress, sameAddress } from "../../helper/utils";
import { useAuthContext } from "../../contexts/AuthContext";
import { followUser, reportUser } from "../../api/api";
import { useSnackbar } from "../../contexts/Snackbar";
import Tooltip from "../common/Tooltip";

const ProfileImage = styled("div")((t) => ({
  border: `3px solid ${t.theme.palette.mode === "light" ? "#eee" : "#27273a"}`,
  borderRadius: 14,
  width: 160,
  height: 160,
  marginTop: -120,
  overflow: "hidden",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
}));

export default function UserProfile({ user, mode }) {
  const { user: currentUser } = useAuthContext();
  const { showSnackbar } = useSnackbar();
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(false);
  const [copied, setCopied] = useState(false);

  const report = async () => {
    await reportUser(user.pubKey);

    showSnackbar({
      severity: "success",
      message: "Successfully reported",
    });
  };

  const isMe = useMemo(
    () => currentUser && sameAddress(currentUser.pubKey, user?.pubKey),
    [user, currentUser]
  );

  const follow = async () => {
    await followUser(user.pubKey);
    setFollowers(following ? followers - 1 : followers + 1);
    setFollowing(!following);
  };

  const copyAddress = () => {
    copyText(user.pubKey);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    setFollowers(user.followers);
    setFollowing(user.following);
  }, [user]);

  return user ? (
    <Paper
      style={{
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    >
      <Box p={2}>
        <Link to={isMe ? "/profile" : `/users/${user.pubKey}`}>
          <ProfileImage
            style={{
              backgroundImage: `url(${user?.avatar || DefaultUser})`,
            }}
          />
        </Link>
        <Box mt={2} mb={2}>
          {user.name && (
            <Typography variant="h6" gutterBottom>
              {user.name}
            </Typography>
          )}
          <Typography mb={1}>
            <Tooltip title={copied ? "Copied!" : "Copy"}>
              <LinkE
                style={{ cursor: "pointer" }}
                fontWeight="bold"
                onClick={copyAddress}
              >
                {minimizeAddress(user.pubKey, 7, -4)}
              </LinkE>
            </Tooltip>
          </Typography>
          {user.bio && (
            <Typography mt={1} variant="subtitle2">
              {user.bio}
            </Typography>
          )}
          <Grid container spacing={1}>
            {user.instagram && (
              <Grid item mt={2}>
                <a
                  href={`https://instagram.com/${user.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <InstagramIcon color="primary" />
                </a>
              </Grid>
            )}
            {user.twitter && (
              <Grid item mt={2}>
                <a
                  href={`https://twitter.com/${user.twitter}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <TwitterIcon color="primary" />
                </a>
              </Grid>
            )}
          </Grid>
        </Box>

        <Divider />
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography mt={2} variant="h6">
              {followers}
            </Typography>
            <Typography>Followers</Typography>
          </Grid>

          <Grid item>
            {currentUser && !isMe && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={
                  following ? (
                    <PersonRemoveRoundedIcon />
                  ) : (
                    <PersonAddAltRoundedIcon />
                  )
                }
                onClick={follow}
              >
                {following ? "Unfollow" : "Follow"}
              </Button>
            )}
          </Grid>
        </Grid>
        {currentUser && !isMe && !user.reported && (
          <Grid container justifyContent="center" mt={2}>
            <Button variant="contained" color="error" onClick={report}>
              REPORT USER
            </Button>
          </Grid>
        )}
      </Box>
    </Paper>
  ) : (
    <></>
  );
}
