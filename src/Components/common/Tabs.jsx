import { Tab, Tabs, useMediaQuery } from "@mui/material";
import { styled } from "@mui/system";

export const StyledTabs = styled((props) => {
  // const xl = useMediaQuery((t) => t.breakpoints.down("xl"));

  return (
    <Tabs
      {...props}
      variant={props.variant || "scrollable"}
      scrollButtons="auto"
      allowScrollButtonsMobile
      TabIndicatorProps={{
        children: <span className="MuiTabs-indicatorSpan" />,
      }}
    />
  );
})(({ theme }) => ({
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
  marginRight: theme.spacing(6),
  minWidth: 0,
  padding: 0,
  minHeight: 64,
  fontSize: 18,
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
  [theme.breakpoints.down("lg")]: {
    fontSize: 16,
    marginRight: theme.spacing(3),
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: 14,
    marginRight: theme.spacing(4),
  },
}));
