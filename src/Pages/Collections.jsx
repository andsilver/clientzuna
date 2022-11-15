import {
  Autocomplete,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import debounce from "lodash.debounce";
import FilterListIcon from "@mui/icons-material/FilterList";

import { filterCollections } from "../api/api";
import CollectionCard from "../Components/Collections/CollectionCard";
import LoadMore from "../Components/common/LoadMore";
import TopBanner from "../Components/common/TopBanner";
import NoData from "../Components/NoData";
import SectionLoading from "../Components/SectionLoading";
import { config } from "../config";
import useLoading from "../hooks/useLoading";
import useQuery from "../hooks/useQuery";
import FormPopupButton from "../Components/common/FormPopupButton";

const FilterContainer = styled("div")((t) => ({
  padding: 12,
  border: `1px solid ${t.theme.palette.mode === "light" ? "#eee" : "#0d0d11"}`,
  borderRadius: 16,
  backgroundColor: t.theme.palette.mode === "light" ? "#f5f5f5" : "#0d0d11",
  marginBottom: 24,
}));

const categories = [...config.categories].filter((c) => c !== "ZunaNauts");

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const { loading, sendRequest } = useLoading();
  const [allLoaded, setAllLoaded] = useState(false);
  const [filter, setFilter] = useState({
    search: "",
    category: "",
    orderBy: "createdAt",
    order: "DESC",
  });
  const [searchText, setSearchText] = useState("");
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

  const fetchCollections = async (init) => {
    try {
      const res = await sendRequest(() =>
        filterCollections({ offset: init ? 0 : collections.length, ...filter })
      );
      setAllLoaded(res.length < config.defaultPageSize);
      setCollections(init ? res : [...collections, ...res]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSort = (order, orderBy) => {
    const searchQuery = new URLSearchParams(query.toString());

    Object.keys(filter).forEach((key) => {
      if (filter[key]) {
        searchQuery.set(key, filter[key]);
      }
    });

    searchQuery.set("order", order);
    searchQuery.set("orderBy", orderBy);

    history.push({
      pathname: location.pathname,
      search: `?${searchQuery.toString()}`,
    });

    handleClose();
  };

  useEffect(() => {
    fetchCollections(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    setFilter({
      search: query.get("search") || "",
      category: query.get("category") || "",
      orderBy: query.get("orderBy") || "createdAt",
      order: query.get("order") || "DESC",
    });
    setSearchText(query.get("search") || null);
  }, [query]);

  useEffect(() => {
    return () => {
      searchDebounceHandler.cancel();
    };
  }, [searchDebounceHandler]);

  const updateSearchText = (e) => {
    setSearchText(e.target.value);
    searchDebounceHandler("search", e.target.value);
  };

  const filterButtonText = useMemo(() => {
    if (filter.orderBy === "totalVolume") {
      return `Volume ${
        filter.order === "DESC" ? "High to Low" : "Low to High"
      }`;
    }

    if (filter.orderBy === "createdAt") {
      return "Recently Added";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div style={{ marginTop: -80 }}>
      <TopBanner>
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          color="white"
        >
          Explore Collections
        </Typography>
      </TopBanner>
      <Container maxWidth="xl" sx={{ pb: 4, pt: 3 }}>
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
                options={categories}
                value={filter.category || null}
                renderInput={(params) => (
                  <TextField {...params} name="category" label="Category" />
                )}
                onChange={(e, v) => updateFilter("category", v)}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              lg={2}
              sx={{
                marginLeft: "auto",
              }}
            >
              <FormPopupButton
                handleClick={handleClick}
                label={filterButtonText}
                icon={
                  <FilterListIcon
                    sx={(t) => ({
                      color:
                        t.palette.mode === "dark"
                          ? "white"
                          : "rgba(0, 0, 0, 0.54)",
                    })}
                  />
                }
              />
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={() => handleSort("DESC", "createdAt")}>
                  Recently Added
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleSort("ASC", "totalVolume")}>
                  Volume High to Low
                </MenuItem>
                <MenuItem onClick={() => handleSort("DESC", "totalVolume")}>
                  Volume Low to High
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </FilterContainer>
        {!!collections.length && (
          <div>
            <Grid container spacing={2}>
              {collections.map((c) => (
                <Grid item key={c.id} xs={12} sm={6} md={4} lg={3}>
                  <CollectionCard collection={c} />
                </Grid>
              ))}
            </Grid>
            <LoadMore
              loading={loading}
              allLoaded={allLoaded}
              loadMore={() => fetchCollections(false)}
            />
          </div>
        )}
        {loading ? <SectionLoading /> : !collections.length && <NoData />}
      </Container>
    </div>
  );
}
