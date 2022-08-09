import {
  Autocomplete,
  Avatar,
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Popover,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, styled } from "@mui/system";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import debounce from "lodash.debounce";

import { config } from "../../config";
import useQuery from "../../hooks/useQuery";
import { filterCollections } from "../../api/api";

const CATEGORIES = [...config.categories];
const SALE_TYPES = ["Buy Now", "Open to bids", "Not for sale"];

const FilterContainer = styled("div")((t) => ({
  padding: 12,
  border: `1px solid ${t.theme.palette.mode === "light" ? "#eee" : "#0d0d11"}`,
  borderRadius: 16,
  backgroundColor: t.theme.palette.mode === "light" ? "#f5f5f5" : "#0d0d11",
}));

export default function ExplorerFilter({ showCollection = true, properties }) {
  const [filter, setFilter] = useState({
    category: null,
    saleType: null,
    search: "",
    collectionId: null,
    properties: {},
  });
  const [searchText, setSearchText] = useState("");
  const [collections, setCollections] = useState([]);
  const query = useQuery();
  const history = useHistory();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const collectionValue = useMemo(
    () => collections.find((c) => c.id === +filter.collectionId) || null,
    [filter, collections]
  );

  const propertyOptions = useMemo(
    () =>
      properties
        ? Object.keys(properties).map((label) => ({
            label,
            options: properties[label],
          }))
        : [],
    [properties]
  );

  const handlePropertyChange = (label, e) => {
    const properties = { ...filter.properties };

    if (e.target.value && e.target.value.length) {
      properties[label] = e.target.value;
    } else {
      delete properties[label];
    }
    const searchQuery = new URLSearchParams(query.toString());
    searchQuery.delete("properties");

    Object.keys(filter).forEach((key) => {
      if (filter[key] && key !== "properties") {
        searchQuery.set(key, filter[key]);
      }
    });

    if (Object.keys(properties).length) {
      const propertyQuery = Object.keys(properties)
        .map((property) => `${property}:${properties[property].join(",")}`)
        .join(";");
      searchQuery.set("properties", propertyQuery);
    }
    history.push({
      pathname: location.pathname,
      search: `?${searchQuery.toString()}`,
    });
  };

  const updateFilter = (name, value) => {
    const searchQuery = new URLSearchParams(query.toString());

    Object.keys(filter).forEach((key) => {
      if (filter[key] && key !== "properties") {
        searchQuery.set(key, filter[key]);
      }
    });

    if (value) {
      searchQuery.set(name, value);
    } else {
      searchQuery.delete(name);
    }

    history.push({
      pathname: location.pathname,
      search: `?${searchQuery.toString()}`,
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchDebounceHandler = useCallback(debounce(updateFilter, 800), [
    query,
    filter,
  ]);

  const updateCollectionFilter = (collection) => {
    updateFilter("collectionId", collection?.id || "");
  };

  useEffect(() => {
    const propertyQueryString = query.get("properties");
    const propertiesValue = propertyQueryString
      ? propertyQueryString.split(";").reduce((q, p) => {
          const [label, value] = p.split(":");
          q[label] = value.split(",");
          return q;
        }, {})
      : {};

    setFilter({
      category: query.get("category") || null,
      saleType: query.get("saleType") || null,
      search: query.get("search") || null,
      collectionId: query.get("collectionId") || null,
      properties: propertiesValue,
    });
    setSearchText(query.get("search") || null);
  }, [query]);

  useEffect(() => {
    if (showCollection) {
      filterCollections({}).then((res) => setCollections(res));
    }
  }, [showCollection]);

  useEffect(() => {
    return () => {
      searchDebounceHandler.cancel();
    };
  }, [searchDebounceHandler]);

  const updateSearchText = (e) => {
    setSearchText(e.target.value);
    searchDebounceHandler("search", e.target.value);
  };

  return (
    <FilterContainer>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            color="primary"
            label="Search..."
            value={searchText || ""}
            onChange={(e) => updateSearchText(e)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <Autocomplete
            fullWidth
            size="small"
            disablePortal
            options={CATEGORIES}
            value={filter.category}
            renderInput={(params) => (
              <TextField {...params} name="category" label="Category" />
            )}
            onChange={(e, v) => updateFilter("category", v)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <Autocomplete
            fullWidth
            size="small"
            disablePortal
            options={SALE_TYPES}
            value={filter.saleType}
            renderInput={(params) => (
              <TextField {...params} name="saleType" label="Sale Type" />
            )}
            onChange={(e, v) => updateFilter("saleType", v)}
          />
        </Grid>
        {showCollection && (
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Autocomplete
              fullWidth
              size="small"
              disablePortal
              options={collections}
              value={collectionValue}
              renderOption={(props, c) => (
                <Grid container alignItems="center" p={1} {...props}>
                  <Avatar sx={{ width: 30, height: 30 }} src={c.image} />
                  <Typography ml={1} fontSize={12} fontWeight="bold">
                    {c.name}
                  </Typography>
                </Grid>
              )}
              isOptionEqualToValue={(option, value) =>
                !value || option.id === value.id
              }
              getOptionLabel={(option) => option.name || ""}
              renderInput={(params) => (
                <TextField {...params} name="collection" label="Collection" />
              )}
              onChange={(e, v) => updateCollectionFilter(v)}
            />
          </Grid>
        )}
        {properties && (
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Button
              variant="outlined"
              color="primary"
              endIcon={<ExpandMoreIcon />}
              onClick={handleClick}
            >
              Properties
            </Button>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Box px={1} py={2}>
                {propertyOptions.map((p) => (
                  <div key={p.label}>
                    <FormControl sx={{ m: 1, mb: 2, width: 240 }} size="small">
                      <InputLabel>{p.label}</InputLabel>
                      <Select
                        multiple
                        value={filter.properties[p.label] || []}
                        onChange={(e) => handlePropertyChange(p.label, e)}
                        input={<OutlinedInput label={p.label} />}
                        renderValue={(selected) => selected.join(", ")}
                        // MenuProps={MenuProps}
                        size="small"
                      >
                        {p.options.map((name) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox
                              sx={{
                                p: 0,
                                pr: 1,
                              }}
                              size="small"
                              checked={
                                !!filter.properties[p.label] &&
                                filter.properties[p.label].indexOf(name) > -1
                              }
                            />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                ))}
              </Box>
            </Popover>
          </Grid>
        )}
      </Grid>
    </FilterContainer>
  );
}
