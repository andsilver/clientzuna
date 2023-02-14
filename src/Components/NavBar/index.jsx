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
  useScrollTrigger,
  useTheme,
} from "@mui/material";
import { useMemo } from "react";
import { styled } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import { useWeb3Modal } from "@web3modal/react";

import HeaderSearch from "./HeaderSearch";
import Logo from "./logo.png";
import LightLogo from "./light-logo.png";
import { useAuthContext } from "../../contexts/AuthContext";
import Link from "../Link";
import ThemeSwitcher from "./ThemeSwitcher";
import UserDropdown from "./UserDropdown";
import Notifications from "./Notifications";

const NavLink = styled(Link)({
  color: "white",
  fontWeight: 600,
  fontSize: 18,
  marginLeft: 36,
});

const ResponsiveNavLink = styled(Link)((t) => ({
  fontWeight: 600,
  fontSize: 18,
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

const LogoImg = styled("img")((t) => ({
  maxWidth: 164,
  [t.theme.breakpoints.up("sm")]: {
    maxWidth: 210,
  },
}));

const NavBar = () => {
  const { user, disconnect, loading } = useAuthContext();
  const [open, setOpen] = useState(false);
  const {
    palette: { mode },
  } = useTheme();
  const { open: openWeb3Modal } = useWeb3Modal();

  const trigger = useScrollTrigger({
    threshold: 200,
    disableHysteresis: true,
  });

  const background = useMemo(() => {
    if (mode === "dark") {
      return "rgba(20,20,31,0.9)";
    }
    return "linear-gradient(227.3deg, rgb(138 32 140 / 90%) 0%, rgb(24 27 129 / 87%) 100.84%)";
  }, [mode]);

  const toggleDrawer = (value) => {
    setOpen(value);
  };

  return (
    <div
      style={{
        background,
        position: trigger ? "fixed" : "absolute",
        width: "100%",
        zIndex: 99,
        borderBottom: "1px solid rgba(235,235,235,0.2)",
        top: 0,
        boxShadow: trigger
          ? "rgb(0 0 0 / 20%) 0px 2px 4px -1px, rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 10px 0px"
          : "none",
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
              <LogoImg src={mode === "light" ? LightLogo : Logo} alt="" />
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
                <NavLink to="/collections">Collections</NavLink>
              </Grid>
              <Grid item display={{ xs: "none", lg: "block" }}>
                <NavLink to="/rewards">Rewards</NavLink>
              </Grid>
              {user ? (
                <>
                  <Grid item display={{ xs: "none", lg: "block" }}>
                    <NavLink to="/create">Create</NavLink>
                  </Grid>
                  <Grid item>
                    <UserDropdown />
                  </Grid>
                  <Notifications user={user} />
                </>
              ) : (
                <Grid item display={{ xs: "none", sm: "block" }}>
                  <ConnectButton
                    startIcon={<i className="fas fa-wallet" />}
                    variant="outlined"
                    color="bright"
                    disabled={loading}
                    onClick={openWeb3Modal}
                  >
                    Wallet Connect
                  </ConnectButton>
                </Grid>
              )}
              <Grid item display={{ xs: "none", lg: "block" }}>
                <ThemeSwitcher />
              </Grid>
              <Grid item display={{ xs: "block", lg: "none" }} sx={{ ml: 1 }}>
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
              backgroundColor: mode === "dark" ? "#14141F" : "#fff",
            },
          }}
          disableBackdropTransition
        >
          <Box sx={{ width: 280 }} pb={4}>
            <List>
              {user ? (
                <></>
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
                      openWeb3Modal();
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
              <ListItem>
                <ResponsiveNavLink to="/collections">
                  Collections
                </ResponsiveNavLink>
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
