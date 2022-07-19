export const config = {
  nftContractAddress: "0x42D7CC41CbE5A3492306162053C869cCc785c271",
  marketContractAddress: "0xF49877BbfEd13BC0C9aaCF07979442543fFC4eF2",
  currencies: {
    WBNB: {
      address: "0xFC43E1F3D208dAEd6161Fc820e5C2146E858651f",
      coinGecko: "wbnb",
    },
  },
  network: "rinkeby",
  networkName: "Rinkeby Testnet",
  networkScan: {
    url: "https://rinkeby.etherscan.io",
    name: "Rinkeby Scan",
  },
  nativeCurrency: "ETH",
  chainId: 4,
  chainRPC: "https://rinkeby.infura.io/v3/2277777c3280436f956e6a3bc011bf6f",
  apiUrl: "http://localhost:3001/api",
  authSignMessage: "Zunaverse",
  cloudinary: {
    url: "https://api.cloudinary.com/v1_1/myfancy/image/upload",
    upload_preset: "hl7913oa",
  },
  sign: {
    zuna: {
      name: "Zunaverse",
      version: "1",
      verifyingContract: "0x42D7CC41CbE5A3492306162053C869cCc785c271",
      chainId: 4,
    },
    market: {
      name: "ZunaverseMarket",
      version: "1",
      verifyingContract: "0xF49877BbfEd13BC0C9aaCF07979442543fFC4eF2",
      chainId: 4,
    },
  },
  pinataGateWay: "https://zunaverse.mypinata.cloud/ipfs/",
  defaultPageSize: 24,
  categories: [
    "Art",
    "Animation",
    "Games",
    "Music",
    "Videos",
    "Memes",
    "Metaverses",
    "ZunaNauts",
  ],
};
