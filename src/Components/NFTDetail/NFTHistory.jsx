import { Box, Grid, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/system";
import { useState, useMemo } from "react";
import moment from "moment";

import Activities from "../Activities";
import UserLink from "../UserLink";
import Bids from "../Bids";

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
  marginRight: theme.spacing(3),
  minWidth: 0,
  padding: 0,
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
}));

export default function NFTHistory({
  nft,
  activities,
  bids,
  currentUser,
  cancelBid,
  acceptBid,
}) {
  const [currentTab, setCurrentTab] = useState(0);
  const {
    palette: { mode },
  } = useTheme();

  const createdDate = useMemo(
    () => (nft ? moment(nft.createdAt).format("YYYY-MMM-DD") : ""),
    [nft]
  );

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
        {currentTab === 0 && <Activities activities={activities} />}
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
          <div>
            <div>
              <Typography color="primary" variant="subtitle2" gutterBottom>
                Owner
              </Typography>
              <UserLink user={nft.owner} />
            </div>
            <Box mt={1}>
              <Typography color="primary" fontWeight={600}>
                Date created
              </Typography>
              <Typography color="primary" variant="subtitle2">
                {createdDate}
              </Typography>
            </Box>
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
          </div>
        )}
      </Box>
    </Box>
  );
}
