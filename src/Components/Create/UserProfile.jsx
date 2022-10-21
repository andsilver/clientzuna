import {
  Box,
  Button,
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
import FlagIcon from "@mui/icons-material/Flag";
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
  width: 200,
  height: 200,
  marginTop: -80,
  overflow: "hidden",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
}));

export default function UserProfile({ user, children }) {
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
      sx={(t) => ({
        borderRadius: 2,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      })}
    >
      <Box
        py={3}
        px={4}
        sx={(t) => ({
          [t.breakpoints.down("md")]: {
            px: 2,
            py: 2,
          },
        })}
      >
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item order={1}>
            <Link to={isMe ? "/profile" : `/users/${user.pubKey}`}>
              <ProfileImage
                style={{
                  backgroundImage: `url(${user?.avatar || DefaultUser})`,
                }}
              />
            </Link>
          </Grid>
          <Grid
            item
            order={2}
            flexGrow={1}
            sx={(t) => ({
              [t.breakpoints.down("md")]: {
                order: 4,
                width: "100%",
              },
            })}
          >
            <Box>
              {user.name && (
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  {user.name}
                </Typography>
              )}
              {user.bio && (
                <Typography maxWidth={500} mt={1} fontSize="16">
                  {user.bio}
                </Typography>
              )}
              <Typography mt={2}>
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
            </Box>
          </Grid>
          <Grid item justifySelf="self-end" order={3}>
            <Grid container spacing={1} justifyContent="flex-end">
              {user.instagram && (
                <Grid item>
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
                <Grid item>
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

            <Grid
              container
              alignItems="center"
              justifyContent="flex-end"
              mt={3}
            >
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
                    sx={{
                      width: 100,
                      boxShadow: "none",
                    }}
                    onClick={follow}
                  >
                    {following ? "Unfollow" : "Follow"}
                  </Button>
                )}
              </Grid>
            </Grid>
            {currentUser && !isMe && !user.reported && (
              <Grid container mt={1} justifyContent="flex-end">
                <Button
                  sx={{
                    width: 100,
                    boxShadow: "none",
                  }}
                  startIcon={<FlagIcon />}
                  variant="contained"
                  color="error"
                  onClick={report}
                >
                  Report
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Box>
      {children}
    </Paper>
  ) : (
    <></>
  );
}
