import { Tab, Tabs } from "@mui/material";
import { styled } from "@mui/system";

export const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    variant="scrollable"
    scrollButtons="auto"
    allowScrollButtonsMobile
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))(({ theme }) => ({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
    backgroundColor: theme.palette.secondary.main,
  },
}));

export const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  marginRight: theme.spacing(3),
  minWidth: 0,
  padding: 0,
  minHeight: 64,
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
}));
