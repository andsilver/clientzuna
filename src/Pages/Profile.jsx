import { Box, Container, Divider, Grid, useTheme } from "@mui/material";
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
import OtherNfts from "../Components/Profile/OtherNfts";
import { useAuthContext } from "../contexts/AuthContext";
import { useSnackbar } from "../contexts/Snackbar";
import { sameAddress } from "../helper/utils";
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

const TABS = [
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
  { label: "Others", value: "others" },
];

export default function Profile() {
  const [tabs, setTabs] = useState(TABS);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    if (sameAddress(profileAddress, user?.pubKey)) {
      setTabs([...TABS, { label: "Rewards", value: "rewards" }]);
    } else {
      setTabs([...TABS]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div style={{ marginTop: -80 }}>
      {loading && <OverlayLoading show={loading} />}
      {profile && (
        <div>
          <UserBanner user={profile} />
          <Container maxWidth="xl">
            <UserProfile user={profile} mode={mode}>
              <Divider sx={{ mt: 3 }} />
              <Box
                px={3}
                sx={(t) => ({
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  background:
                    t.palette.mode === "dark" ? "#1F1F2C" : t.palette.grey[100],
                })}
              >
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
              </Box>
            </UserProfile>
            <Grid container spacing={2}>
              <Grid item xs={12} py={3} mt={3}>
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
                  {currentTab === "others" && (
                    <OtherNfts userAddress={profileAddress} />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Container>
        </div>
      )}
    </div>
  );
}
