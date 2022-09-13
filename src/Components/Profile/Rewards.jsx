import { Grid, MenuItem, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import { getUserRewards } from "../../api/api";
import { config } from "../../config";
import useLoading from "../../hooks/useLoading";
import NoData from "../NoData";
import SectionLoading from "../SectionLoading";
import RewardsTable from "../Rewards/RewardsTable";

export default function Rewards({ userAddress }) {
  const { loading, sendRequest } = useLoading();
  const [filter, setFilter] = useState({
    rewardType: "",
    startDate: "",
    endDate: "",
  });
  const [rewards, setRewards] = useState([]);
  const [allLoaded, setAllLoaded] = useState(false);

  const fetchRewards = async (init = false) => {
    const res = await sendRequest(() =>
      getUserRewards(userAddress, {
        ...filter,
        offset: init ? 0 : rewards.length,
      })
    );

    if (res) {
      setRewards(res);
      setAllLoaded(res.length < config.defaultPageSize);
    }
  };

  const updateFilter = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    fetchRewards(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, userAddress]);

  return (
    <>
      <Grid container alignItems="center" spacing={2} py={2}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            select
            value={filter.rewardType}
            size="small"
            fullWidth
            color="secondary"
            name="rewardType"
            onChange={updateFilter}
            label="Reward Type"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="static">Static Reward</MenuItem>
            <MenuItem value="buyback">Buyback Reward</MenuItem>
          </TextField>
        </Grid>
      </Grid>
      <RewardsTable rewards={rewards} />
      {loading ? <SectionLoading /> : !rewards.length && <NoData />}
    </>
  );
}
