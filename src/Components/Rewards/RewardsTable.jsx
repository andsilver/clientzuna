import { memo } from "react";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import moment from "moment";
import LaunchIcon from "@mui/icons-material/Launch";

import { config } from "../../config";
import Link from "../Link";

export default memo(({ rewards, detail = false }) => {
  return rewards.length ? (
    <TableContainer component={Paper}>
      <Table sx={{ width: "100%" }}>
        <TableHead>
          <TableRow>
            {!detail && <TableCell>Reward Type</TableCell>}
            <TableCell>Nft</TableCell>
            <TableCell align="right">Tier</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Tx</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rewards.map((r) => (
            <TableRow
              key={r.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {!detail && (
                <TableCell component="th" scope="row">
                  <Typography fontSize={12} textTransform="capitalize">
                    {r.rewardType}
                  </Typography>
                </TableCell>
              )}
              <TableCell align="right">
                <Link to={`/items/${r.nft.id}`}>
                  <Tooltip title={r.nft.name}>
                    <div
                      alt=""
                      style={{
                        borderRadius: 10,
                        width: 50,
                        height: 50,
                        backgroundImage: `url(${r.nft.thumbnail})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                  </Tooltip>
                </Link>
              </TableCell>
              <TableCell align="right">{r.rewardTier}</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <></>
  );
});
