import {
  Autocomplete,
  Avatar,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
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

export default function ExplorerFilter({ showCollection = true }) {
  const [filter, setFilter] = useState({
    category: null,
    saleType: null,
    search: "",
    collectionId: null,
  });
  const [searchText, setSearchText] = useState("");
  const [collections, setCollections] = useState([]);
  const query = useQuery();
  const history = useHistory();
  const location = useLocation();

  const collectionValue = useMemo(
    () => collections.find((c) => c.id === +filter.collectionId) || null,
    [filter, collections]
  );

  const updateFilter = (name, value) => {
    const searchQuery = new URLSearchParams(query.toString());

    Object.keys(filter).forEach((key) => {
      if (filter[key]) {
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
    setFilter({
      category: query.get("category") || null,
      saleType: query.get("saleType") || null,
      search: query.get("search") || null,
      collectionId: query.get("collectionId") || null,
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
      </Grid>
    </FilterContainer>
  );
}
