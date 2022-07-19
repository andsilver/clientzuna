import { Divider, Grid, Typography, useTheme } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";
import ImageLogo from "./logo.png";

const Footer = () => {
  const theme = useTheme();

  return (
    <footer
      style={{
        background: "#0D0D11",
        padding: "50px 0 0",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={2} mb={4}>
          <Grid item xs={12} md={6}>
            <img width={220} src={ImageLogo} alt="Logo" />
            <Typography
              color="white"
              maxWidth={320}
              fontSize={14}
              lineHeight="1.6"
              marginTop={2}
            >
              The best place to buy and sell NFT’s using Binance Smart Chain,
              brought to you by the team behind{" "}
              <a
                href="https://zunacoin.com/"
                className="redirect-link"
                target="blank"
                style={{
                  color: theme.palette.secondary.main,
                  textDecoration: "none",
                }}
              >
                $ZUNA
              </a>
              .
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography color="white" variant="h6" fontWeight="bold">
              Join the community
            </Typography>
            <div
              style={{
                fontSize: 20,
                marginTop: 12,
                paddingLeft: 12,
              }}
            >
              <a
                href="https://twitter.com/zunaverse_io"
                target="_blank"
                style={{ color: "white", textDecoration: "none" }}
                rel="noreferrer"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://www.facebook.com/zunaverse"
                target="blank"
                style={{
                  color: "white",
                  textDecoration: "none",
                  margin: "0 12px",
                }}
                rel="noreferrer"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://www.instagram.com/zunaverse_io/"
                target="blank"
                style={{ color: "white", textDecoration: "none" }}
                rel="noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </Grid>
        </Grid>
        <Divider />
        <Grid container py={2}>
          <Grid item>
            <Typography color="white" variant="subtitle2">
              © ZUNAVERSE 2022.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
