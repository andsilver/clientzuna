import {
  Divider,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import ListIcon from "@mui/icons-material/List";
import LogoutIcon from "@mui/icons-material/Logout";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { useAuthContext } from "../../contexts/AuthContext";
import { minimizeAddress } from "../../helper/utils";
import DefaultUserImg from "../../assets/default_user.png";
import Link from "../Link";

const UserMenu = styled(Menu)({
  "& .MuiPaper-root": {
    minWidth: 180,
    borderRadius: 8,
  },
});

const UserImage = styled("img")((t) => ({
  borderRadius: 12,
  cursor: "pointer",
  border: "1px solid grey",
  width: 40,
  height: 40,
  [t.theme.breakpoints.down("sm")]: {
    width: 30,
    height: 30,
  },
}));

export default function UserDropdown() {
  const { user, disconnect, balance } = useAuthContext();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const theme = useTheme();

  return user ? (
    <div>
      <div onClick={handleClick} style={{ marginLeft: 36 }}>
        <UserImage src={user.avatar || DefaultUserImg} alt="" />
      </div>

      <UserMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          style: {
            backgroundColor: theme.palette.mode === "dark" ? "#14141F" : "#fff",
          },
        }}
      >
        <div
          style={{
            minWidth: 280,
            paddingLeft: 16,
            paddingRight: 16,
            paddingBottom: 8,
          }}
        >
          <Typography variant="h6" color="primary">
            {user.name || "Unnamed"}
          </Typography>
          <Typography color="primary" mt={1}>
            Balance
          </Typography>
          <Typography variant="body1" color="secondary" fontWeight="bold">
            {balance} BNB
          </Typography>

          <Typography color="primary" mt={1}>
            Wallet
          </Typography>
          <Grid container alignItems="center" justifyContent="space-between">
            <Typography color="primary">
              {minimizeAddress(user.pubKey, 7, -4)}
            </Typography>
            <IconButton size="small">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Grid>
        </div>
        <Divider sx={{ mb: 1 }} />
        <Link to="/profile">
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
        </Link>
        <Link to="/profile-settings">
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
        </Link>
        <Link to="/activity">
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText>Activity</ListItemText>
          </MenuItem>
        </Link>
        <Divider sx={{ my: 1 }} />
        <MenuItem
          onClick={() => {
            handleClose();
            disconnect();
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </UserMenu>
    </div>
  ) : (
    <></>
  );
}
