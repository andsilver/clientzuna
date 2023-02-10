import SwipeableViews from "react-swipeable-views";

import { useCurrency } from "../../contexts/CurrencyContext";
import NftPreview from "./NftPreview";

export default function NftPreviews({
  nfts,
  previews,
  currentIndex,
  handleStepChange,
}) {
  const { coins } = useCurrency();

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
