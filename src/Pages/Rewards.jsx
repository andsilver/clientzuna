import {
  Box,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";

import { getRewards } from "../api/api";
import { config } from "../config";
import { useAuthContext } from "../contexts/AuthContext";
import useLoading from "../hooks/useLoading";
import Link from "../Components/Link";
import SectionLoading from "../Components/SectionLoading";
import NoData from "../Components/NoData";
import RewardsFilter from "../Components/Rewards/RewardsFilter";
import TopBanner from "../Components/common/TopBanner";

export default function Rewards() {
  const { loading, sendRequest } = useLoading();
  const { user } = useAuthContext();
  const [rewards, setRewards] = useState([]);
  const [allLoaded, setAllLoaded] = useState(false);
  const history = useHistory();

  const [filter, setFilter] = useState({
    rewardType: "",
    startDate: null,
    endDate: null,
  });

  const fetchRewards = async (init) => {
    try {
      const res = await sendRequest(() =>
        getRewards({
          ...filter,
          offset: init ? 0 : rewards.length,
        })
      );

      if (res) {
        setRewards(init ? res : [...rewards, ...res]);
        setAllLoaded(res.length < config.defaultPageSize);
      }
    } catch (err) {
      console.error(err);
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
  }, [filter]);

  return (
    <div style={{ marginTop: -80 }}>
      <TopBanner>
        <Typography
          variant="h3"
          fontWeight="bold"
          color="primary"
          textAlign="center"
        >
          Rewards Status
        </Typography>
      </TopBanner>
      <Container maxWidth="xl">
        <RewardsFilter filter={filter} onUpdate={updateFilter} />
        <Box py={2}>
          {!!rewards.length && (
            <TableContainer component={Paper}>
              <Table sx={{ width: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Reward Type</TableCell>
                    <TableCell align="right">Date</TableCell>
                    <TableCell align="right">Tx</TableCell>
                    <TableCell align="right">Detail</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rewards.map((r) => (
                    <TableRow
                      key={r.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Typography fontSize={12} textTransform="capitalize">
                          {r.rewardType}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {moment(r.createdAt).format("YYYY/MMM/DD")}
                      </TableCell>
                      <TableCell align="right">
                        <a
                          href={`${config.networkScan.url}/tx/${r.txHash}`}
                          target="__blank"
                        >
                          <IconButton color="primary">
                            <LaunchIcon color="primary" />
                          </IconButton>
                        </a>
                      </TableCell>
                      <TableCell align="right">
                        <Link to={`/rewards/${r.id}`}>
                          <IconButton color="primary">
                            <LaunchIcon color="primary" />
                          </IconButton>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {loading ? <SectionLoading /> : !rewards.length && <NoData />}
        </Box>
      </Container>
    </div>
  );
}
