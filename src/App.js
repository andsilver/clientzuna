import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useTheme } from "@mui/material";

import "./App.scss";
import NavBar from "./Components/NavBar";
import HomePage from "./Pages/Home";
import Footer from "./Components/Footer/Footer";
// import NFTDetailComponent from "./Pages/NftDetail";
// import NAVItemsList from "./Pages/NFTItemsList";
// import CreateNFTCollection from "./Pages/CreateNFTCollection";
import Loading from "./Components/Loading";
import Meta from "./Components/common/Meta";

const Create = lazy(() => import("./Pages/Create"));
const NftDetail = lazy(() => import("./Pages/NftDetail"));
const Settings = lazy(() => import("./Pages/Settings"));
const Profile = lazy(() => import("./Pages/Profile"));
const Explorer = lazy(() => import("./Pages/Explorer"));
const Collection = lazy(() => import("./Pages/Collection"));
const Activity = lazy(() => import("./Pages/Activity"));

function App() {
  const {
    palette: { background },
  } = useTheme();

  return (
    <div style={{ background: background.default }}>
      <Router>
        <NavBar />
        <Meta
          title="Discover Out Of This World NFT's on Binance Smart Chain"
          description="Zunaverse is an NFT marketplace built on Binance Smart Chain, where you can Create, Buy and Sell with faster transactions and lower fees."
          image="https://res.cloudinary.com/zunaverse-media/image/upload/v1659707919/home/zunaverse_jzqaus.png"
          url={window.location.origin}
        />
        <div style={{ background, minHeight: "calc(100vh)" }}>
          <Suspense fallback={<Loading />}>
            <Switch>
              <Route path="/" exact>
                <HomePage />
              </Route>
              <Route path="/create" exact>
                <Create />
              </Route>
              <Route path="/explorer" exact>
                <Explorer />
              </Route>
              <Route path="/profile-settings" exact>
                <Settings />
              </Route>
              <Route path="/users/:address">
                <Profile />
              </Route>
              <Route path="/profile">
                <Profile />
              </Route>
              <Route path="/activity">
                <Activity />
              </Route>
              <Route path="/collections/:id">
                <Collection />
              </Route>
              {/* <Route path="/collections/new" element={<NewCollection />} />
              <Route
                path="/collections/create"
                element={<NewCollectionForm />}
              /> */}
              <Route path="/items/:id" exact>
                <NftDetail />
              </Route>
            </Switch>
          </Suspense>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
