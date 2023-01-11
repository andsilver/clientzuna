import {
  Badge,
  Grid,
  IconButton,
  Popover,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import EmptyNft from "../../assets/empty.png";

import { getNotifications, readNotifications } from "../../api/api";
import Link from "../Link";
import { timeSince } from "../../helper/utils";
import { config } from "../../config";

export default function Notifications({ user }) {
  const [notifications, setNotifications] = useState([]);
  const {
    palette: { mode },
  } = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    if (notifications.length) {
      readNotifications();
    }
    setNotifications([]);
    setAnchorEl(null);
  };

  const fetchNotifications = async () => {
    const res = await getNotifications();
    setNotifications(
      res.map((n) => ({
        ...n,
        nft: {
          ...n.nft,
          image:
            n.nft.image?.replace("ipfs://", config.pinataGateWay) || EmptyNft,
        },
        timeSince: timeSince(n.createdAt),
      }))
    );
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const open = Boolean(anchorEl);

  return user ? (
    <>
      <IconButton style={{ marginLeft: 12 }} onClick={handleClick}>
        <Badge badgeContent={notifications.length} color="secondary">
          <NotificationsIcon style={{ color: "white" }} />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        PaperProps={{
          style: {
            borderRadius: 8,
            backgroundColor: mode === "dark" ? "#14141f" : "#fff",
          },
        }}
      >
        <Typography
          fontSize={18}
          color="primary"
          fontWeight="bold"
          px={2}
          pb={1}
          pt={2}
        >
          Notifications
        </Typography>
        {notifications.length ? (
          notifications.map((n) => (
            <Grid
              key={n.id}
              my={1}
              ml={1}
              mr={3}
              container
              alignItems="center"
              spacing={1}
              minWidth={300}
            >
              <Grid item>
                <Link to={`/items/${n.nft.id}`}>
                  <div
                    style={{
                      backgroundImage: `url(${n.nft.thumbnail})`,
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      overflow: "hidden",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </Link>
              </Grid>
              <Grid item>
                <Typography
                  variant="subtitle1"
                  color="primary"
                  maxWidth={300}
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {n.text}
                </Typography>
                <Typography fontSize={10} color="primary">
                  {n.timeSince}
                </Typography>
              </Grid>
            </Grid>
          ))
        ) : (
          <Typography p={2} minWidth={260}>
            No new notifications
          </Typography>
        )}
      </Popover>
    </>
  ) : (
    <></>
  );
}
