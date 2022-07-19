import {
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import ListIcon from "@mui/icons-material/List";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuthContext } from "../../contexts/AuthContext";
import { minimizeAddress } from "../../helper/utils";
import DefaultUserImg from "../../assets/default_user.png";
import Link from "../Link";

const UserContainer = styled("div")`
  display: inline-flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  padding: 0 2px 0 3px;
  height: 40px;
  border: 2px solid white;
  border-radius: 30px;
  cursor: pointer;
  transition: 0.5s ease;
  transition-property: color, background-color, border-color, box-shadow;
  margin-left: 34px;

  &:hover {
    border-color: ${(t) => t.theme.palette.secondary.main};
  }

  img {
    width: 35px !important;
    height: 35px;
    border-radius: 50%;
    margin-right: 4px;
    object-fit: cover;
    object-position: center;
  }
`;

const UserMenu = styled(Menu)({
  "& .MuiPaper-root": {
    minWidth: 180,
    borderRadius: 8,
  },
});

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

  return user ? (
    <div>
      <UserContainer onClick={handleClick}>
        <img src={user.avatar || DefaultUserImg} alt="" />
        <Box marginLeft={1} marginRight={1} minWidth={80}>
          <Typography color="white" fontWeight="bold" fontSize={13}>
            {user.name || minimizeAddress(user.pubKey, 7, -4)}
          </Typography>
          <Typography color="white" variant="body2" fontSize={10}>
            {balance} BNB
          </Typography>
        </Box>
        <ExpandMoreIcon style={{ color: "white" }} />
      </UserContainer>

      <UserMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Link to="/profile">
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <PersonIcon fontSize="small" color="secondary" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
        </Link>
        <Link to="/profile-settings">
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" color="secondary" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
        </Link>
        <Link to="/activity">
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <ListIcon fontSize="small" color="secondary" />
            </ListItemIcon>
            <ListItemText>Activity</ListItemText>
          </MenuItem>
        </Link>
        <Divider />
        <MenuItem
          onClick={() => {
            handleClose();
            disconnect();
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="secondary" />
          </ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </UserMenu>
    </div>
  ) : (
    <></>
  );
}
