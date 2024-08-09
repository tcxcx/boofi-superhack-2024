import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserWallets, getNetwork } from "@dynamic-labs/sdk-react-core";
import { config } from "@/store/wagmi";

interface Chain {
  chainId: string;
  tokens: {
    token: string;
    address: string;
  }[];
}

// the supported bridge chains dictionary we need to use for the multichain functionality
const supportedBridgeTokensDictionary: Chain[] = [
  {
    chainId: "1",
    chain: "Ethereum",
    tokens: [
      {
        token: "usdc",
        address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      },
      {
        token: "usdt",
        address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      },
    ],
  },
  {
    chainId: "10",
    chain: "Optimism",
    tokens: [
      {
        token: "usdc",
        address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
      },
      {
        token: "usdc",
        address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
      },
    ],
  },
  {
    chainId: "8453",
    chain: "Base",
    tokens: [
      {
        token: "usdc",
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      },
    ],
  },
];

const chainIcons: { [key: number]: string } = {
  1: "/icons/ethereum-eth-logo.svg",
  11155111: "/icons/ethereum-eth-logo.svg", // sepolia
  10: "/icons/optimism-ethereum-op-logo.svg",
  11155420: "/icons/optimism-ethereum-op-logo.svg", // optimismSepolia
  42220: "/icons/celo-celo-logo.svg",
  44787: "/icons/celo-celo-logo.svg", // celoAlfajores
  8453: "/icons/base-logo-in-blue.svg",
  84532: "/icons/base-logo-in-blue.svg", // baseSepolia
  34443: "/icons/mode-logo.svg",
  919: "/icons/mode-logo.svg", // modeTestnet
};

interface NetworkSelectorProps {
  onSelect?: (chainId: string) => void;
  currentChainId: string;
}

interface Chain {
  chain: string;
  chainId: string;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  onSelect,
  currentChainId,
}) => {
  const userWallets = useUserWallets();
  const [currentNetwork, setCurrentNetwork] = useState<{
    id: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    const fetchNetwork = async () => {
      if (userWallets.length > 0) {
        const network = await getNetwork(userWallets[0].connector);
        if (network) {
          const chain = config.chains.find((chain) => chain.id === network);
          if (chain) {
            setCurrentNetwork(chain);
          }
        }
      }
    };

    fetchNetwork();
  }, [userWallets]);

  const handleNetworkChange = (networkId: string) => {
    const selectedChain = config.chains.find(
      (chain) => chain.id.toString() === networkId
    );
    if (selectedChain) {
      setCurrentNetwork(selectedChain);
      onSelect?.(networkId);
    }
  };

  const availableChains = supportedBridgeTokensDictionary.filter(
    (chain: Chain) => chain.chainId !== currentChainId
  );

  const mainnets = config.chains.filter((chain) => !chain.testnet);
  const testnets = config.chains.filter((chain) => chain.testnet);

  return (
    <div className="w-full">
      <Select
        onValueChange={handleNetworkChange}
        value={currentNetwork?.id.toString() || ""}
      >
        <SelectTrigger className="w-full border-transparent flex justify-between">
          <SelectValue>
            {currentNetwork ? (
              <div className="flex items-center">
                <img
                  src={chainIcons[currentNetwork.id]}
                  alt={currentNetwork.name}
                  className="inline-block w-4 h-4 mr-2"
                />
                {currentNetwork.name}
              </div>
            ) : (
              "Select Destination Chain"
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Available Chains</SelectLabel>
            {availableChains.map((chain: Chain) => (
              <SelectItem key={chain.chainId} value={chain.chainId}>
                <img
                  src={chainIcons[parseInt(chain.chainId)]}
                  alt={chain.chain}
                  className="inline-block w-4 h-4 mr-2"
                />
                {chain.chain.charAt(0).toUpperCase() + chain.chain.slice(1)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default NetworkSelector;
