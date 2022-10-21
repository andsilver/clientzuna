import { Container, Typography } from "@mui/material";
import TopBanner from "../Components/common/TopBanner";
import UserActivities from "../Components/Profile/UserActivities";
import { useAuthContext } from "../contexts/AuthContext";

export default function Activity() {
  const { user } = useAuthContext();

  return (
    <div style={{ marginTop: -80 }}>
      <TopBanner>
        <Typography
          variant="h3"
          fontWeight="bold"
          color="white"
          textAlign="center"
        >
          Activities
        </Typography>
      </TopBanner>
      {user ? (
        <Container maxWidth="xl" sx={{ mb: 8, pt: 3 }}>
          <UserActivities userAddress={user.pubKey} />
        </Container>
      ) : (
        <></>
      )}
    </div>
  );
}
