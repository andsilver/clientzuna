import { alpha, styled } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { IconButton, InputBase, TextField } from "@mui/material";
import { useHistory } from "react-router-dom";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "60px",
  border: "2px solid white",
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.05),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  top: 0,
  right: -14,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "white",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 2),
    fontSize: 13,
    fontWeight: 600,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
      "&:focus": {
        width: "30ch",
      },
    },
    "&::-webkit-input-placeholder": {
      color: "gray",
    },
  },
}));

export default function HeaderSearch({ mobile = false }) {
  const [term, setTerm] = useState("");
  const history = useHistory();

  const onKeyDown = (e) => {
    if (e.code === "Enter") {
      history.push(`/explorer?search=${term}`);
    }
  };

  return mobile ? (
    <TextField
      variant="outlined"
      size="small"
      value={term}
      placeholder="Search..."
      fullWidth
      onChange={(e) => setTerm(e.target.value)}
      onKeyDown={onKeyDown}
    />
  ) : (
    <Search>
      <StyledInputBase
        placeholder="Search…"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <SearchIconWrapper>
        <IconButton size="small">
          <SearchIcon style={{ color: "white" }} />
        </IconButton>
      </SearchIconWrapper>
    </Search>
  );
}
