import { Container, Typography } from "@mui/material";
import UserActivities from "../Components/Profile/UserActivities";
import { useAuthContext } from "../contexts/AuthContext";

export default function Activity() {
  const { user } = useAuthContext();

  return user ? (
    <Container maxWidth="xl" sx={{ mb: 8 }}>
      <Typography variant="h4" color="primary" my={3} fontWeight="bold">
        Activity
      </Typography>
      <UserActivities userAddress={user.pubKey} size={6} />
    </Container>
  ) : (
    <></>
  );
}
