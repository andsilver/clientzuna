import { Badge, Grid, IconButton, Popover, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { styled } from "@mui/system";

import { getNotifications, readNotifications } from "../../api/api";
import Link from "../Link";
import { timeSince } from "../../helper/utils";
import { config } from "../../config";

const NotificationHeader = styled("div")((t) => ({
  padding: 15,
  borderRadius: 15,
  background: t.theme.palette.mode === "light" ? "#f5f5f5" : "#222234",
}));

export default function Notifications({ user }) {
  const [notifications, setNotifications] = useState([]);

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
          image: n.nft.image.replace("ipfs://", config.pinataGateWay),
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
      <IconButton style={{ marginLeft: 24 }} onClick={handleClick}>
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
      >
        <NotificationHeader>
          <Typography variant="subtitle1" color="primary" fontWeight="bold">
            Notifications
          </Typography>
        </NotificationHeader>
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
                      backgroundImage: `url(${n.nft.image})`,
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
