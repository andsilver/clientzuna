import { Button, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { filterCollections } from "../../api/api";
import { sameAddress } from "../../helper/utils";
import CollectionCard from "../Collections/CollectionCard";
import NoData from "../NoData";
import SectionLoading from "../SectionLoading";
import CreateCollectionDialog from "./CreateCollectionDialog";

export default function Collections({ userAddress, currentUser }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateCollection, setShowCreateCollection] = useState(false);

  const fetchCollections = async () => {
    setLoading(true);

    try {
      const res = await filterCollections({
        owner: userAddress,
      });
      setCollections(res);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleCreate = () => {
    setShowCreateCollection(false);
    fetchCollections();
  };

  const isMe = useMemo(
    () => sameAddress(userAddress, currentUser?.pubKey),
    [userAddress, currentUser]
  );

  useEffect(() => {
    fetchCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]);

  return (
    <div>
      {isMe && (
        <Grid container mt={3} mb={2}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ borderRadius: 2 }}
            onClick={() => setShowCreateCollection(true)}
          >
            Create a collection
          </Button>
        </Grid>
      )}
      {collections.length ? (
        <Grid container spacing={2}>
          {collections.map((c) => (
            <Grid item xs={12} sm={6} md={4} xl={3} key={c.id}>
              <CollectionCard collection={c} />
            </Grid>
          ))}
        </Grid>
      ) : (
        !loading && <NoData />
      )}
      {loading && <SectionLoading />}
      {showCreateCollection && (
        <CreateCollectionDialog
          onClose={() => setShowCreateCollection(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
