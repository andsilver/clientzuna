import { Grid, MenuItem, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

export default function RewardsFilter({ filter, onUpdate }) {
  return (
    <Grid container alignItems="center" spacing={2} py={2}>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <TextField
          select
          value={filter.rewardType}
          size="small"
          fullWidth
          color="secondary"
          name="rewardType"
          onChange={(e) => onUpdate({ rewardType: e.target.value })}
          label="Reward Type"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="static">Static Reward</MenuItem>
          <MenuItem value="buyback">Buyback Reward</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <DatePicker
          label="Start Date"
          value={filter.startDate}
          onChange={(newValue) => {
            onUpdate({
              startDate: newValue ? new Date(newValue) : null,
            });
          }}
          renderInput={(params) => (
            <TextField size="small" color="secondary" fullWidth {...params} />
          )}
          disableFuture
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <DatePicker
          label="End Date"
          value={filter.endDate}
          onChange={(newValue) => {
            onUpdate({
              endDate: newValue ? new Date(newValue) : null,
            });
          }}
          renderInput={(params) => (
            <TextField size="small" color="secondary" fullWidth {...params} />
          )}
          disableFuture
        />
      </Grid>
    </Grid>
  );
}
