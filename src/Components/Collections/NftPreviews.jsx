import SwipeableViews from "react-swipeable-views";

import { useCoinGecko } from "../../contexts/CoinGeckoContext";
import NftPreview from "./NftPreview";

export default function NftPreviews({
  nfts,
  previews,
  currentIndex,
  handleStepChange,
}) {
  const { coins } = useCoinGecko();

  return (
    <SwipeableViews
      index={currentIndex}
      onChangeIndex={handleStepChange}
      enableMouseEvents
    >
      {nfts.map((nft, index) => (
        <NftPreview
          key={nft.tokenId}
          coins={coins}
          preview={previews[index]}
          nft={nft}
        />
      ))}
    </SwipeableViews>
  );
}
