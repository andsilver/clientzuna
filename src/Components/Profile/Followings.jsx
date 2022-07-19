import { Card, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getFollowing, getFollowers } from "../../api/api";
import UserLink from "../UserLink";
import { minimizeAddress } from "../../helper/utils";
import useLoading from "../../hooks/useLoading";
import NoData from "../NoData";

export default function Followings({ userAddress, follower = false }) {
  const [users, setUsers] = useState([]);
  const { loading, sendRequest } = useLoading();

  const fetchFollowing = async () => {
    if (!userAddress) {
      return;
    }
    const res = await sendRequest(() =>
      follower ? getFollowers(userAddress) : getFollowing(userAddress)
    );
    setUsers(res);
  };

  useEffect(() => {
    fetchFollowing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]);

  return (
    <>
      {!loading && !users.length ? <NoData /> : <></>}
      {!!users.length && (
        <Grid container spacing={3}>
          {users.map((u) => (
            <Grid key={u.profile.id} item xs={12} md={6}>
              <Card sx={{ p: 1 }}>
                <Grid container spacing={2}>
                  <Grid item>
                    <UserLink
                      user={u.profile}
                      rounded={false}
                      size={100}
                      showName={false}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2">
                      {u.followers} followers
                    </Typography>
                    <Typography fontWeight="bold">
                      {u.profile.name ||
                        minimizeAddress(u.profile.pubKey, 6, -4)}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
