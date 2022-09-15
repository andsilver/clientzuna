import { useEffect, useState } from "react";

import { getUserRewards } from "../../api/api";
import { config } from "../../config";
import useLoading from "../../hooks/useLoading";
import NoData from "../NoData";
import SectionLoading from "../SectionLoading";
import RewardsTable from "../Rewards/RewardsTable";
import RewardsFilter from "../Rewards/RewardsFilter";
import LoadMore from "../common/LoadMore";

export default function Rewards({ userAddress }) {
  const { loading, sendRequest } = useLoading();
  const [filter, setFilter] = useState({
    rewardType: "",
    startDate: null,
    endDate: null,
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
      ...e,
    });
  };

  useEffect(() => {
    fetchRewards(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, userAddress]);

  return (
    <>
      <RewardsFilter filter={filter} onUpdate={updateFilter} />
      <RewardsTable rewards={rewards} />
      {loading ? <SectionLoading /> : !rewards.length && <NoData />}
      <LoadMore
        loading={loading}
        allLoaded={allLoaded}
        loadMore={fetchRewards}
      />
    </>
  );
}
