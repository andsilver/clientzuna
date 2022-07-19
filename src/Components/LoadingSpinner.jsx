import { styled } from "@mui/system";

const LoadingSpinner = styled("div")`
  margin: auto;
  height: 100px;
  width: 100px;
  border: transparent;
  border-top: 3px solid #1273eb;
  border-radius: 50%;
  -webkit-animation: round 2s linear infinite;
  animation: round 2s linear infinite;
`;

export default LoadingSpinner;
