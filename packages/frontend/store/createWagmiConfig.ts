import { createConfig, http } from "wagmi";
import {
  baseSepolia,
  sepolia,
  modeTestnet,
  optimismSepolia,
  celoAlfajores,
} from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

export function createWagmiConfig(projectId?: string) {
  if (projectId) {
    console.log("projectId:", projectId);
  }

  return createConfig({
    chains: [sepolia, baseSepolia, modeTestnet, optimismSepolia, celoAlfajores],
    connectors: [
      coinbaseWallet({
        appName: "Boofi | Spooky Finance",
        preference: "smartWalletOnly",
      }),
    ],
    ssr: true,
    transports: {
      [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!),
      [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL!),
      [modeTestnet.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL!),
      [optimismSepolia.id]: http(
        process.env.NEXT_PUBLIC_OPTIMISM_SEPOLIA_RPC_URL!
      ),
      [celoAlfajores.id]: http(process.env.NEXT_PUBLIC_CELO_ALFAJORES_RPC_URL!),
    },
  });
}
