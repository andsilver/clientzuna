import { Box, Grid, Typography } from "@mui/material";
import { memo } from "react";

const Sections = [
  {
    title: "Set up your wallet",
    text: "You have successfully connected to your wallet.",
    icon: (
      <svg
        style={{ height: 20, fill: "#5142FC" }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M19,7H18V6a3,3,0,0,0-3-3H5A3,3,0,0,0,2,6H2V18a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V10A3,3,0,0,0,19,7ZM5,5H15a1,1,0,0,1,1,1V7H5A1,1,0,0,1,5,5ZM20,15H19a1,1,0,0,1,0-2h1Zm0-4H19a3,3,0,0,0,0,6h1v1a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V8.83A3,3,0,0,0,5,9H19a1,1,0,0,1,1,1Z"></path>
      </svg>
    ),
    backgroundColor: "rgba(97,100,255,0.15)",
  },
  {
    title: "Create your collection",
    text: "Click Create and set up your collection. Add social links, a description, profile & banner images, and set a secondary sales fee.",
    icon: (
      <svg
        style={{ height: 20, fill: "#25a56a" }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M10,13H4a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V14A1,1,0,0,0,10,13ZM9,19H5V15H9ZM20,3H14a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V4A1,1,0,0,0,20,3ZM19,9H15V5h4Zm1,7H18V14a1,1,0,0,0-2,0v2H14a1,1,0,0,0,0,2h2v2a1,1,0,0,0,2,0V18h2a1,1,0,0,0,0-2ZM10,3H4A1,1,0,0,0,3,4v6a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V4A1,1,0,0,0,10,3ZM9,9H5V5H9Z"></path>
      </svg>
    ),
    backgroundColor: "rgba(37,165,106,0.15)",
  },
  {
    title: "Add your NFTs",
    text: "Upload your work, add a title and description, and customize your NFTs with properties, stats, and unlockable content.",
    icon: (
      <svg
        style={{ height: 20, fill: "#8051d4" }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M22.71,6.29a1,1,0,0,0-1.42,0L20,7.59V2a1,1,0,0,0-2,0V7.59l-1.29-1.3a1,1,0,0,0-1.42,1.42l3,3a1,1,0,0,0,.33.21.94.94,0,0,0,.76,0,1,1,0,0,0,.33-.21l3-3A1,1,0,0,0,22.71,6.29ZM19,13a1,1,0,0,0-1,1v.38L16.52,12.9a2.79,2.79,0,0,0-3.93,0l-.7.7L9.41,11.12a2.85,2.85,0,0,0-3.93,0L4,12.6V7A1,1,0,0,1,5,6h8a1,1,0,0,0,0-2H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V14A1,1,0,0,0,19,13ZM5,20a1,1,0,0,1-1-1V15.43l2.9-2.9a.79.79,0,0,1,1.09,0l3.17,3.17,0,0L15.46,20Zm13-1a.89.89,0,0,1-.18.53L13.31,15l.7-.7a.77.77,0,0,1,1.1,0L18,17.21Z"></path>
      </svg>
    ),
    backgroundColor: "rgba(128,81,212,0.15)",
  },
  {
    title: "List them for sale",
    text: "Choose between auctions, fixed-price listings, and declining-price listings. You choose how you want to sell your NFTs, and we help you sell them!",
    icon: (
      <svg
        style={{ height: 20, fill: "#eb5757" }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M15,12a1,1,0,1,0,1-1A1,1,0,0,0,15,12Zm6.71-.71-5-5A1,1,0,0,0,16,6H5A3,3,0,0,0,2,9v6a3,3,0,0,0,3,3H16a1,1,0,0,0,.71-.29l5-5A1,1,0,0,0,21.71,11.29ZM15.59,16H5a1,1,0,0,1-1-1V9A1,1,0,0,1,5,8H15.59l4,4Z"></path>
      </svg>
    ),
    backgroundColor: "rgba(235,87,87,0.15)",
  },
];

export default memo(() => (
  <Grid mt={2} mb={4} container spacing={3}>
    {Sections.map((s) => (
      <Grid item key={s.title} xs={12} sm={6} md={4} lg={3}>
        <Grid container alignItems="center">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
              width: 45,
              height: 45,
              backgroundColor: s.backgroundColor,
            }}
          >
            {s.icon}
          </Box>
          <Typography fontWeight="bold" color="primary" ml={1}>
            {s.title}
          </Typography>
        </Grid>
        <Typography
          mt={2}
          sx={{
            color: (t) => (t.palette.mode === "dark" ? "white" : "#686869"),
          }}
          fontSize={13}
          lineHeight="24px"
        >
          {s.text}
        </Typography>
      </Grid>
    ))}
  </Grid>
));
