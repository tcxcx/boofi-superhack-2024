import { http, createConfig } from "wagmi";
import {
  mainnet,
  optimism,
  optimismSepolia,
  celo,
  celoAlfajores,
  base,
  baseSepolia,
  mode,
  modeTestnet,
  sepolia,
} from "wagmi/chains";

export const config = createConfig({
  chains: [
    mainnet,
    sepolia,
    optimism,
    optimismSepolia,
    celo,
    base,
    baseSepolia,
    mode,
    modeTestnet,
  ],
  multiInjectedProviderDiscovery: false,
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [optimism.id]: http(),
    [optimismSepolia.id]: http(),
    [celo.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [mode.id]: http(),
    [modeTestnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
