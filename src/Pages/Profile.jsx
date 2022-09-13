import { Box, Container, Grid, Paper, useTheme } from "@mui/material";
import { styled } from "@mui/system";

import { useEffect, useState, useMemo } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { getProfile } from "../api/api";
import OverlayLoading from "../Components/common/OverlayLoading";
import { StyledTabs, StyledTab } from "../Components/common/Tabs";
import UserBanner from "../Components/Create/UserBanner";
import UserProfile from "../Components/Create/UserProfile";
import Collections from "../Components/Profile/Collections";
import Followings from "../Components/Profile/Followings";
import NftsCollected from "../Components/Profile/NftsCollected";
import NftsCreated from "../Components/Profile/NftsCreated";
import NftsFavorited from "../Components/Profile/NftsFavorited";
import NftsOnSale from "../Components/Profile/NftsOnSale";
import Rewards from "../Components/Profile/Rewards";
import UserActivities from "../Components/Profile/UserActivities";
import { useAuthContext } from "../contexts/AuthContext";
import { useSnackbar } from "../contexts/Snackbar";
import useQuery from "../hooks/useQuery";

const FollowTag = styled("div")((t) => ({
  background: t.theme.palette.secondary.main,
  color: "white",
  borderRadius: "50%",
  fontSize: 10,
  width: 16,
  height: 16,
  lineHeight: "16px",
}));

const tabs = [
  {
    label: "Collections",
    value: "collections",
  },
  {
    label: "On Sale",
    value: "on-sale",
  },
  {
    label: "Created",
    value: "created",
  },
  { label: "Collected", value: "collectibles" },
  {
    label: "Liked",
    value: "liked",
  },
  { label: "Activity", value: "activity" },
  { label: "Following", value: "following" },
  { label: "Followers", value: "followers" },
  { label: "Rewards", value: "rewards" },
];

export default function Profile() {
  const { user } = useAuthContext();
  const query = useQuery();
  const [profile, setProfile] = useState(null);
  const { address } = useParams();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState("");
  const {
    palette: { mode },
  } = useTheme();
  const profileAddress = useMemo(
    () => address || user?.pubKey,
    [user, address]
  );
  const { showSnackbar } = useSnackbar();

  const fetchProfile = async () => {
    if (!profileAddress) {
      return;
    }
    setLoading(true);

    try {
      const res = await getProfile(profileAddress);
      setProfile(res);
    } catch (err) {
      console.error(err);
      showSnackbar({
        severity: "error",
        message: "Failed to load the profile",
      });
    }

    setLoading(false);
  };

  const onChangeTab = (v) => {
    history.push({
      pathname: location.pathname,
      search: `?tab=${v}`,
    });
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileAddress]);

  useEffect(() => {
    const v = query.get("tab") || tabs[0].value;
    setCurrentTab(v);
  }, [query]);

  return (
    <>
      {loading && <OverlayLoading show={loading} />}
      {profile && (
        <div>
          <UserBanner user={profile} />
          <Container maxWidth="xl">
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <UserProfile user={profile} mode={mode} />
              </Grid>
              <Grid item xs={12} md={9} py={3} mt={3}>
                <Paper sx={{ px: 3 }}>
                  <StyledTabs
                    textColor={mode === "light" ? "secondary" : "primary"}
                    indicatorColor="secondary"
                    value={currentTab}
                    onChange={(e, v) => onChangeTab(v)}
                  >
                    {tabs.map((tab) => (
                      <StyledTab
                        disableRipple
                        icon={
                          tab.value === "followers" ? (
                            <FollowTag>{profile.followers}</FollowTag>
                          ) : tab.value === "following" ? (
                            <FollowTag>{profile.followings}</FollowTag>
                          ) : (
                            <></>
                          )
                        }
                        iconPosition="end"
                        label={tab.label}
                        key={tab.value}
                        value={tab.value}
                      />
                    ))}
                  </StyledTabs>
                </Paper>
                <Box mt={2}>
                  {currentTab === "collections" && (
                    <Collections
                      userAddress={profileAddress}
                      currentUser={user}
                    />
                  )}
                  {currentTab === "on-sale" && (
                    <NftsOnSale userAddress={profileAddress} />
                  )}
                  {currentTab === "created" && (
                    <NftsCreated userAddress={profileAddress} />
                  )}
                  {currentTab === "collectibles" && (
                    <NftsCollected userAddress={profileAddress} />
                  )}
                  {currentTab === "liked" && (
                    <NftsFavorited userAddress={profileAddress} />
                  )}
                  {currentTab === "activity" && (
                    <UserActivities userAddress={profileAddress} />
                  )}
                  {currentTab === "following" && (
                    <Followings userAddress={profileAddress} follower={false} />
                  )}
                  {currentTab === "followers" && (
                    <Followings userAddress={profileAddress} follower />
                  )}
                  {currentTab === "rewards" && (
                    <Rewards userAddress={profileAddress} />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Container>
        </div>
      )}
    </>
  );
}
