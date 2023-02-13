import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useTheme } from "@mui/material";

import "react-multi-carousel/lib/styles.css";
import "swiper/swiper.min.css";
import "swiper/modules/navigation/navigation.min.css";
import "swiper/modules/autoplay/autoplay.min.css";
import "swiper/modules/free-mode/free-mode.min.css";

import "./App.scss";
import NavBar from "./Components/NavBar";
import HomePage from "./Pages/Home";
import Footer from "./Components/Footer/Footer";
import Loading from "./Components/Loading";
import Meta from "./Components/common/Meta";

const Create = lazy(() => import("./Pages/Create"));
const NftDetail = lazy(() => import("./Pages/NftDetail"));
const Settings = lazy(() => import("./Pages/Settings"));
const Profile = lazy(() => import("./Pages/Profile"));
const Explorer = lazy(() => import("./Pages/Explorer"));
const Collections = lazy(() => import("./Pages/Collections"));
const Collection = lazy(() => import("./Pages/Collection"));
const Activity = lazy(() => import("./Pages/Activity"));
const Rewards = lazy(() => import("./Pages/Rewards"));
const Reward = lazy(() => import("./Pages/Reward"));
const BulkMint = lazy(() => import("./Pages/BulkMint"));

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
        <div style={{ background, minHeight: "calc(100vh)", paddingTop: 80 }}>
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
              <Route path="/collections" exact>
                <Collections />
              </Route>
              <Route path="/collections/:id" exact>
                <Collection />
              </Route>
              <Route path="/items/:tokenAddress/:tokenId" exact>
                <NftDetail />
              </Route>
              <Route path="/rewards" exact>
                <Rewards />
              </Route>
              <Route path="/rewards/:id" exact>
                <Reward />
              </Route>
              <Route path="/bulk-mint/:id" exact>
                <BulkMint />
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
