import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import CoinSymbol from "../common/CoinSymbol";
import UserLink from "../UserLink";
import Link from "../Link";

export default function BidsTable({ bids, incoming }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableCell>Nft</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Bid</TableCell>
          <TableCell>{incoming ? "Bidder" : "Owner"}</TableCell>
          <TableCell align="right">Created</TableCell>
        </TableHead>
        <TableBody>
          {bids.map((b) => (
            <TableRow
              key={b.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Link to={`/items/${b.nft.tokenAddress}/${b.nft.tokenId}`}>
                  <div
                    alt=""
                    style={{
                      borderRadius: 10,
                      width: 60,
                      height: 60,
                      backgroundImage: `url(${b.nft.thumbnail})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                </Link>
              </TableCell>
              <TableCell>
                <Typography variant="h6" color="primary">
                  {b.nft.name}
                </Typography>
              </TableCell>
              <TableCell>
                <CoinSymbol
                  coin={b.price.coin}
                  price={b.price.amount}
                  usd={b.price.usd}
                  size={16}
                />
              </TableCell>
              <TableCell>
                <UserLink user={incoming ? b.bidder : b.nft.owner} />
              </TableCell>
              <TableCell align="right">{b.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
