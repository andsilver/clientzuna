export const config = {
  nftContractAddress: "0x30e4D42014A735A5F376Cc2C09618292f3bC93c5",
  marketContractAddress: "0xdBC67a9EEdC690c6367DA224cFf486D7D1Fdf1bB",
  currencies: {
    WBNB: {
      address: "0xFC43E1F3D208dAEd6161Fc820e5C2146E858651f",
      coinGecko: "wbnb",
      decimals: 18,
    },
    ZUNA: {
      address: "0x9Ab56a8f461D4A3727983b99F88000b3367F8B9c",
      coinGecko: "zuna",
      decimals: 9,
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
  sign: {
    zuna: {
      name: "Zunaverse",
      version: "1",
      verifyingContract: "0x30e4D42014A735A5F376Cc2C09618292f3bC93c5",
      chainId: 4,
    },
    market: {
      name: "ZunaverseMarket",
      version: "1",
      verifyingContract: "0xdBC67a9EEdC690c6367DA224cFf486D7D1Fdf1bB",
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
