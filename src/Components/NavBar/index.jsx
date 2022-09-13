import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  SwipeableDrawer,
  useTheme,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { styled } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";

import HeaderSearch from "./HeaderSearch";
import Logo from "./logo.png";
// import WhatIsWallet from "../Cards/WhatIsWalletCard/WhatIsWallet";
import { useAuthContext } from "../../contexts/AuthContext";
import Link from "../Link";
import ThemeSwitcher from "./ThemeSwitcher";
import UserDropdown from "./UserDropdown";
import UserLink from "../UserLink";
import Notifications from "./Notifications";

const NavLink = styled(Link)({
  color: "white",
  fontWeight: 600,
  fontSize: 16,
  marginLeft: 24,
});

const ResponsiveNavLink = styled(Link)((t) => ({
  fontWeight: 600,
  fontSize: 16,
  color: t.theme.palette.primary.main,
  marginTop: 6,
  marginBottom: 6,
  marginLeft: 6,
}));

const ConnectButton = styled(Button)({
  padding: "8px 28px",
  fontSize: 14,
  marginLeft: 16,
  "&:hover": {
    color: "#5142FC",
    background: "white",
  },
});

const NavBar = () => {
  const { connect, user, balance, disconnect } = useAuthContext();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const {
    palette: { mode },
  } = useTheme();

  const background = useMemo(() => {
    if (mode === "dark") {
      return "transparent";
    }
    return pathname === "/"
      ? "transparent"
      : "linear-gradient(227.3deg, #8A208C 0%, #181B81 100.84%)";
  }, [pathname, mode]);

  const toggleDrawer = (value) => {
    setOpen(value);
  };

  return (
    <div
      style={{
        background,
        position: pathname === "/" ? "absolute" : "relative",
        width: "100%",
        zIndex: 99,
        borderBottom: mode === "dark" ? "1px solid rgba(235,235,235,0.2)" : "",
      }}
    >
      <Container maxWidth="xl">
        <Grid
          height="80px"
          container
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            <Link style={{ textDecoration: "none" }} to="/">
              <img
                style={{
                  maxWidth: 210,
                }}
                src={Logo}
                alt=""
              />
            </Link>
          </Grid>
          <Grid item display={{ xs: "none", md: "block" }}>
            <HeaderSearch />
          </Grid>
          <Grid item>
            <Grid container alignItems="center">
              <Grid item display={{ xs: "none", lg: "block" }}>
                <NavLink to="/explorer">Explore</NavLink>
              </Grid>
              <Grid item display={{ xs: "none", lg: "block" }}>
                <NavLink to="/rewards">Rewards</NavLink>
              </Grid>
              {user ? (
                <>
                  <Grid item display={{ xs: "none", lg: "block" }}>
                    <NavLink to="/create">Create</NavLink>
                  </Grid>
                  <Notifications user={user} />
                </>
              ) : (
                <Grid item display={{ xs: "none", sm: "block" }}>
                  <ConnectButton
                    startIcon={<i className="fas fa-wallet" />}
                    variant="outlined"
                    color="bright"
                    onClick={connect}
                  >
                    Wallet Connect
                  </ConnectButton>
                </Grid>
              )}
              <Grid item display={{ xs: "none", md: "block" }}>
                <UserDropdown />
              </Grid>
              <Grid item display={{ xs: "none", lg: "block" }}>
                <ThemeSwitcher />
              </Grid>
              <Grid item display={{ xs: "block", lg: "none" }} sx={{ ml: 3 }}>
                <IconButton color="bright" onClick={() => toggleDrawer(!open)}>
                  <MenuIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <SwipeableDrawer
          anchor="right"
          open={open}
          onClose={() => toggleDrawer(false)}
          onOpen={() => toggleDrawer(true)}
          PaperProps={{
            style: {
              borderRadius: 0,
            },
          }}
          disableBackdropTransition
        >
          <Box sx={{ width: 280 }} pb={4}>
            <List>
              {user ? (
                <ListItem>
                  <UserLink user={user} extraText={`${balance} BNB`} />
                </ListItem>
              ) : (
                <ListItem>
                  <ConnectButton
                    fullWidth
                    sx={{ m: 0, background: "white" }}
                    startIcon={<i className="fas fa-wallet" />}
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      toggleDrawer(false);
                      connect();
                    }}
                  >
                    Wallet Connect
                  </ConnectButton>
                </ListItem>
              )}
              <ListItem>
                <HeaderSearch mobile />
              </ListItem>
              <ListItem>
                <ResponsiveNavLink to="/explorer">Explore</ResponsiveNavLink>
              </ListItem>
              <ListItem>
                <ResponsiveNavLink to="/rewards">Rewards</ResponsiveNavLink>
              </ListItem>
              {user && (
                <>
                  <ListItem>
                    <ResponsiveNavLink to="/create">Create</ResponsiveNavLink>
                  </ListItem>
                  <ListItem>
                    <ResponsiveNavLink to="/activity">
                      Activity
                    </ResponsiveNavLink>
                  </ListItem>
                  <ListItem>
                    <ResponsiveNavLink to="/profile-settings">
                      Settings
                    </ResponsiveNavLink>
                  </ListItem>
                  <ListItem>
                    <ResponsiveNavLink onClick={disconnect} to="/">
                      Sign Out
                    </ResponsiveNavLink>
                  </ListItem>
                </>
              )}
              <Divider />
              <ListItem>
                <Grid container justifyContent="flex-end">
                  <ThemeSwitcher />
                </Grid>
              </ListItem>
            </List>
          </Box>
        </SwipeableDrawer>
      </Container>
    </div>
  );
};

export default NavBar;
