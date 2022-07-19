import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import useQuery from "../../hooks/useQuery";

const EVENTS = ["MINT", "SALES", "BIDS", "LIKES", "FOLLOWINGS", "TRANSFERS"];

export default function ActivityFilter() {
  const query = useQuery();
  const [filter, setFilter] = useState({
    categories: [],
  });
  const history = useHistory();
  const location = useLocation();

  const clearFilter = () => {
    const newQuery = new URLSearchParams(query.toString());
    newQuery.delete("categories");

    history.push({
      pathname: location.pathname,
      search: `?${newQuery.toString()}`,
    });
  };

  const updateFilter = (event, v) => {
    let events = [];

    if (v) {
      events = [...filter.categories, event];
    } else {
      events = filter.categories.filter((e) => e !== event);
    }
    const newQuery = new URLSearchParams(query.toString());

    if (events.length) {
      newQuery.set("categories", events.join(","));
    } else {
      newQuery.delete("categories");
    }

    history.push({
      pathname: location.pathname,
      search: `?${newQuery.toString()}`,
    });
  };

  useEffect(() => {
    setFilter({
      categories: query.get("categories")?.split(",") || [],
    });
  }, [query]);

  return (
    <Card sx={{ width: "100%", position: "sticky", top: 36 }}>
      <CardContent>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography fontSize={24} fontWeight="bold" color="primary">
            Filters
          </Typography>
          <Button size="small" onClick={clearFilter}>
            <Link color="secondary" underline="none">
              Clear all
            </Link>
          </Button>
        </Grid>
        <FormGroup>
          {EVENTS.map((e) => (
            <FormControlLabel
              onChange={(event, v) => updateFilter(e, v)}
              key={e}
              checked={filter.categories.includes(e)}
              control={<Checkbox color="secondary" />}
              label={e.toLowerCase()}
              sx={{ textTransform: "capitalize" }}
            />
          ))}
        </FormGroup>
      </CardContent>
    </Card>
  );
}
