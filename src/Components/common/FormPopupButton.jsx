import { Button } from "@mui/material";
import { memo } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default memo(({ handleClick, label, icon }) => (
  <Button
    variant="outlined"
    color="primary"
    fullWidth
    endIcon={
      icon || (
        <ArrowDropDownIcon
          sx={(t) => ({
            color: t.palette.mode === "dark" ? "white" : "rgba(0, 0, 0, 0.54)",
          })}
        />
      )
    }
    onClick={handleClick}
    sx={(t) => ({
      color:
        t.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.7)"
          : "rgba(0, 0, 0, 0.6)",
      borderRadius: "6px",
      borderColor: t.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "",
      borderWidth: 1,
      justifyContent: "space-between",
      padding: "5px 13px",
      fontWeight: 400,
      fontSize: 15,
      "&:hover": {
        borderWidth: 1,
      },
    })}
  >
    {label}
  </Button>
));
