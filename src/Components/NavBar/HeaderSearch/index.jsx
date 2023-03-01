import { alpha, styled } from "@mui/system";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Avatar,
  Grid,
  IconButton,
  InputBase,
  TextField,
  Typography,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import { debounce } from "@mui/material/utils";

import EmptyImg from "../../../assets/empty.png";
import { searchMarketplace } from "../../../api/api";
import Link from "../../Link";
import { minimizeAddress } from "../../../helper/utils";

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
    paddingRight: 36,
    fontSize: 15,
    fontWeight: 600,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
      "&:focus": {
        width: "40ch",
      },
    },
    "&::-webkit-input-placeholder": {
      color: "gray",
    },
  },
}));

export default function HeaderSearch({ mobile = false }) {
  const [term, setTerm] = useState("");
  const [options, setOptions] = useState([]);
  const history = useHistory();

  const fetch = useMemo(
    () =>
      debounce(async (text, callback) => {
        try {
          const res = await searchMarketplace(text);
          callback(
            res.map((item) => ({
              ...item,
              optionLabel: `${item.name || ""} ${item.description || " "} ${
                item.address || " "
              }`,
              displayLabel: `${item.name || minimizeAddress(item.address)}`,
              category: `${
                item.category.charAt(0).toUpperCase() + item.category.slice(1)
              }s`,
              link:
                item.category === "nft"
                  ? `/items/${item.address}/${item.tokenId}`
                  : item.category === "user"
                  ? `/users/${item.address}`
                  : `/collections/${item.originId}`,
            }))
          );
        } catch (err) {
          console.error(err);
          callback([]);
        }
      }, 800),
    []
  );

  const onKeyDown = (e) => {
    if (e.code === "Enter") {
      history.push(`/explorer?search=${term}`);
    }
  };

  useEffect(() => {
    let active = true;

    if (term.length < 2) {
      setOptions([]);
      return;
    }

    if (!fetch) {
      return;
    }
    fetch(term, (res) => {
      if (!active) {
        return;
      }
      setOptions(res);
    });

    return () => {
      active = false;
    };
  }, [term, fetch]);

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
    <Autocomplete
      getOptionLabel={(option) => option.optionLabel || ""}
      options={options}
      sx={{ width: 300 }}
      groupBy={(option) => option.category}
      inputValue={term}
      value={""}
      noOptionsText="No Result"
      disableClearable
      freeSolo
      onChange={() => {
        setTerm("");
      }}
      onInputChange={(event, newInputValue) => {
        setTerm(newInputValue);
      }}
      renderInput={({ InputLabelProps, InputProps, ...rest }) => (
        <Search {...InputLabelProps}>
          <SearchIconWrapper>
            <IconButton size="small">
              <SearchIcon style={{ color: "white" }} />
            </IconButton>
          </SearchIconWrapper>
          <StyledInputBase
            {...InputProps}
            {...rest}
            placeholder="Search…"
            fullWidth
          />
        </Search>
      )}
      renderOption={(props, option) => (
        <Link key={option.id} to={option.link}>
          <li {...props}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              py={0.5}
              wrap="nowrap"
            >
              <Grid item>
                <Avatar
                  variant="rounded"
                  src={option.image || EmptyImg}
                  sx={{ width: 36, height: 36 }}
                />
              </Grid>
              <Grid item>
                <Typography fontSize={16}>{option.displayLabel}</Typography>
              </Grid>
            </Grid>
          </li>
        </Link>
      )}
    />
  );
}
