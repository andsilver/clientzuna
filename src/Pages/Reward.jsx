import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { getReward } from "../api/api";
import SectionLoading from "../Components/SectionLoading";
import { config } from "../config";
import RewardsTable from "../Components/Rewards/RewardsTable";
import Link from "../Components/Link";

export default function Reward() {
  const { id } = useParams();
  const [reward, setReward] = useState();

  const fetchReward = async () => {
    const res = await getReward(id);
    setReward(res);
  };

  useEffect(() => {
    fetchReward();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return reward ? (
    <Container maxWidth="lg">
      <Typography variant="h3" fontWeight="bold" color="primary" mb={3} mt={3}>
        Rewards Details
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Typography
                variant="caption"
                color="primary"
                fontWeight={600}
                mb={2}
              >
                Reward Type
              </Typography>
              <Typography color="primary" textTransform="capitalize" mt={1}>
                {reward.reward.rewardType}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="caption"
                color="primary"
                fontWeight={600}
                mb={2}
              >
                Reward Date
              </Typography>
              <Typography color="primary" textTransform="capitalize" mt={1}>
                {moment(reward.reward.createdAt).format("YYYY/MMM/DD")}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="caption"
                color="primary"
                fontWeight={600}
                mb={2}
              >
                Transaction
              </Typography>
              <Typography>
                <a
                  href={`${config.networkScan.url}/tx/${reward.reward.txHash}`}
                  target="__blank"
                >
                  <IconButton color="primary">
                    <LaunchIcon color="primary" />
                  </IconButton>
                </a>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        {[1, 2, 3, 4, 5, 6].map((tier) => (
          <Accordion key={tier}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="caption" color="primary" fontWeight={600}>
                Tier {tier} Holders
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {reward.reward[`tier${tier}Holders`].map((h) => (
                <Link to={`/users/${h}`}>
                  <Typography color="secondary" variant="body2">
                    {h}
                  </Typography>
                </Link>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Card>
      <Card sx={{ my: 3 }}>
        <RewardsTable detail rewards={reward.details} />
      </Card>
    </Container>
  ) : (
    <SectionLoading />
  );
}
