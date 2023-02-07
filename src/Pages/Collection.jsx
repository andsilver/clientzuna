import { Box, useTheme } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { getOneCollection } from "../api/api";
import BulkMint from "../Components/Collections/BulkMint";
import CollectionActivities from "../Components/Collections/CollectionActivities";
import CollectionInfo from "../Components/Collections/CollectionInfo";
import CollectionItems from "../Components/Collections/CollectionItems";
import OverlayLoading from "../Components/common/OverlayLoading";
import PageBanner from "../Components/common/PageBanner";
import { StyledTab, StyledTabs } from "../Components/common/Tabs";
import ExplorerFilter from "../Components/Explorer/Filter";
import CreateCollectionDialog from "../Components/Profile/CreateCollectionDialog";
import { useAuthContext } from "../contexts/AuthContext";
import { useSnackbar } from "../contexts/Snackbar";
import { useWeb3 } from "../contexts/Web3Context";
import useLoading from "../hooks/useLoading";
import useQuery from "../hooks/useQuery";

const TABS = [
  {
    label: "Items",
    value: "items",
  },
  {
    label: "Activity",
    value: "activity",
  },
];

export default function Collection() {
  const { id } = useParams();
  const [collection, setCollection] = useState();
  const { user } = useAuthContext();
  const { loading, sendRequest } = useLoading();
  const [currentTab, setCurrentTab] = useState("");
  const query = useQuery();
  const history = useHistory();
  const location = useLocation();
  const {
    palette: { mode },
  } = useTheme();
  const [showEdit, setShowEdit] = useState(false);
  const [showBulkMint, setShowBulkMint] = useState(false);
  const { wrongNetwork } = useWeb3();
  const { showSnackbar } = useSnackbar();

  const fetchCollection = async () => {
    const res = await sendRequest(
      () => getOneCollection(id),
      "Failed to load the collection"
    );

    if (!res) {
      return;
    }
    setCollection(res);
  };

  const handleUpdate = () => {
    setShowEdit(false);
    fetchCollection();
  };

  useEffect(() => {
    fetchCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const v = query.get("tab") || TABS[0].value;
    setCurrentTab(v);
  }, [query]);

  const onChangeTab = (v) => {
    history.push({
      pathname: location.pathname,
      search: `?tab=${v}`,
    });
  };

  const handleImport = () => {
    if (wrongNetwork) {
      return showSnackbar({
        severity: "warning",
        message: "You are on a wrong network.",
      });
    }
    setShowBulkMint(true);
  };

  const isCollectionOwner = user?.id === collection?.owner.id;

  return (
    <div style={{ marginTop: -80 }}>
      {loading && <OverlayLoading show />}
      {collection && (
        <>
          <PageBanner image={collection.banner} />
          <Container maxWidth="xl">
            <CollectionInfo
              collection={collection}
              isOwner={isCollectionOwner}
              onEdit={() => setShowEdit(true)}
              onImport={handleImport}
            />
            <StyledTabs
              textColor={mode === "light" ? "secondary" : "primary"}
              indicatorColor="secondary"
              variant="scrollable"
              value={currentTab}
              onChange={(e, v) => onChangeTab(v)}
              sx={{
                minHeight: 48,
                mt: 3,
                borderBottom: (t) => `1px solid ${t.palette.divider}`,
              }}
            >
              {TABS.map((tab) => (
                <StyledTab
                  disableRipple
                  label={tab.label}
                  key={tab.value}
                  value={tab.value}
                />
              ))}
            </StyledTabs>
            <Box my={4}>
              {currentTab === "items" && (
                <div>
                  <ExplorerFilter
                    showCollection={false}
                    properties={collection.properties}
                  />
                  <CollectionItems collection={collection} />
                </div>
              )}
              {currentTab === "activity" && (
                <CollectionActivities collection={collection} />
              )}
            </Box>
          </Container>
          {showEdit && !!collection && (
            <CreateCollectionDialog
              collectionData={collection}
              onClose={() => setShowEdit(false)}
              onCreate={handleUpdate}
            />
          )}
          {showBulkMint && !!collection && (
            <BulkMint
              onClose={() => setShowBulkMint(false)}
              collectionId={collection.id}
            />
          )}
        </>
      )}
    </div>
  );
}
