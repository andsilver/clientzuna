import { Box, Grid, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/system";
import { useState, useMemo, useEffect } from "react";
import moment from "moment";

import Activities from "../Activities";
import UserLink from "../UserLink";
import Bids from "../Bids";
import { getNftActivities } from "../../api/api";
import { config } from "../../config";

const StyledTabs = styled(Tabs)((t) => ({
  borderBottom: `1px solid ${t.theme.palette.divider}`,
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    maxWidth: 40,
  },
  "& .MuiTabs-indicatorSpan": {
    width: "100%",
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  marginRight: theme.spacing(4),
  minWidth: 0,
  padding: 0,
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
  fontSize: 18,
}));

export default function NFTHistory({
  nft,
  bids,
  currentUser,
  cancelBid,
  acceptBid,
}) {
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [activitiesLoadedAll, setActivitiesLoadedAll] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const {
    palette: { mode },
  } = useTheme();

  const createdDate = useMemo(
    () => (nft ? moment(nft.createdAt).format("YYYY-MMM-DD") : ""),
    [nft]
  );

  const fetchActivites = async (init = false) => {
    setLoadingActivities(true);

    try {
      const res = await getNftActivities(
        nft.tokenAddress,
        nft.tokenId,
        init ? 0 : activities.length
      );
      setActivities(init ? res : [...activities, ...res]);
      setActivitiesLoadedAll(res.length < config.defaultPageSize);
    } catch (err) {
      console.error(err);
    }
    setLoadingActivities(false);
  };

  useEffect(() => {
    fetchActivites(true);
  });

  return (
    <Box mt={3}>
      <StyledTabs
        textColor={mode === "light" ? "secondary" : "primary"}
        indicatorColor="secondary"
        value={currentTab}
        onChange={(e, v) => setCurrentTab(v)}
      >
        <StyledTab disableRipple color="secondary" label="History" />
        <StyledTab disableRipple label="Bids" />
        <StyledTab disableRipple label="Details" />
      </StyledTabs>
      <Box mt={2}>
        {currentTab === 0 && (
          <Activities
            loading={loadingActivities}
            allLoaded={activitiesLoadedAll}
            activities={activities}
            loadMore={fetchActivites}
          />
        )}
        {currentTab === 1 && (
          <Bids
            nft={nft}
            bids={bids}
            currentUser={currentUser}
            cancelBid={cancelBid}
            acceptBid={acceptBid}
          />
        )}
        {currentTab === 2 && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <UserLink extraText="Created By" user={nft.creator} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography color="primary" fontWeight={600}>
                Date created
              </Typography>
              <Typography color="primary" variant="subtitle2">
                {createdDate}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography mt={1} color="primary" fontWeight={600}>
                Properties
              </Typography>
              <Grid container spacing={2}>
                {nft.properties.map((p, index) => (
                  <Grid item key={index}>
                    <Typography color="primary" variant="subtitle2">
                      {p.name} - {p.value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
}
