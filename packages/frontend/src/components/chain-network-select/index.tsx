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
    chainId: "11155111",
    chain: "Ethereum Sepolia",
    tokens: [
      {
        token: "usdc",
        address: "0x45Df5e83B9400421cb3B262b31ee7236b61219D5",
      },
      {
        token: "usdt",
        address: "0x523C8591Fbe215B5aF0bEad65e65dF783A37BCBC",
      },
      {
        token: "dai",
        address: "0x68194a729C2450ad26072b3D33ADaCbcef39D574",
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
        token: "usdt",
        address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
      },
    ],
  },
  {
    chainId: "11155420",
    chain: "Optimism Sepolia",
    tokens: [
      {
        token: "usdc",
        address: "0x4bA3A5ab2EC0C9C45F153374fbcb05a1526C4a01",
      },
      {
        token: "usdc",
        address: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
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
      {
        token: "dai",
        address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
      },
    ],
  },
  {
    chainId: "84532",
    chain: "Base Sepolia",
    tokens: [
      {
        token: "usdc",
        address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      },
      {
        token: "usdt",
        address: "0x73b4a58138CCcBDa822dF9449FeDA5eaC6669ebD",
      },
    ],
  },
  {
    chainId: "42220",
    chain: "Celo",
    tokens: [
      {
        token: "cusd",
        address: "0x765de816845861e75a25fca122bb6898b8b1282a",
      },
      {
        token: "celo",
        address: "0xf194afdf50b03e69bd7d057c1aa9e10c9954e4c9",
      },
    ],
  },
  {
    chainId: "44787",
    chain: "Celo Alfajores",
    tokens: [
      {
        token: "usdc",
        address: "0x2f25deb3848c207fc8e0c34035b3ba7fc157602b",
      },
      {
        token: "cusd",
        address: "0x874069fa1eb16d44d622f2e0ca25eea172369bc1",
      },
      {
        token: "ceur",
        address: "0x10c892a6ec43a53e45d0b916b4b7d383b1b78c0f",
      },
      {
        token: "celo",
        address: "0xf194afdf50b03e69bd7d057c1aa9e10c9954e4c9",
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
