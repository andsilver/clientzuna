import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { bsc, bscTestnet } from "wagmi/chains";

import { config } from "./config";

const chains = config.chainId === 97 ? [bscTestnet] : [bsc];

const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: config.walletConnectProjectId }),
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({
    projectId: config.walletConnectProjectId,
    version: "1",
    appName: "Zunaverse",
    chains,
  }),
  provider,
});

const ethereumClient = new EthereumClient(wagmiClient, chains);

export default function WalletConnect({ children }) {
  return (
    <>
      <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>

      <Web3Modal
        projectId={config.walletConnectProjectId}
        ethereumClient={ethereumClient}
      />
    </>
  );
}
