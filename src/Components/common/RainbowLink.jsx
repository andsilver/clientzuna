import { Typography } from "@mui/material";
import { memo } from "react";
import Link from "../Link";

export default memo(({ link, text }) => (
  <Link to={link}>
    <Typography
      fontSize={14}
      fontWeight={600}
      color="primary"
      sx={{
        position: "relative",
        "&:hover": {
          background: "linear-gradient(to right, #E250E5,#4B50E6,#E250E5)",
          WebkitBackgroundClip: "text",
          backgroundSize: "200% 200%",
          animation: "rainbow 2s ease-in-out infinite;",
          color: "transparent",
        },
        "&::after": {
          background:
            "linear-gradient(216.56deg, #E250E5 5.32%, #4B50E6 94.32%)",
          content: "''",
          position: "absolute",
          left: 0,
          bottom: -4,
          width: "100%",
          height: "1px",
        },
      }}
    >
      {text}
    </Typography>
  </Link>
));
