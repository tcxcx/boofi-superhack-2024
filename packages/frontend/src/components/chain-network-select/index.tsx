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

const chainIcons: { [key: number]: string } = {
  1: "/icons/ethereum-eth-logo.svg",
  11_155_111: "/icons/ethereum-eth-logo.svg", // sepolia
  10: "/icons/optimism-ethereum-op-logo.svg",
  11155420: "/icons/optimism-ethereum-op-logo.svg", // optimismSepolia
  42220: "/icons/celo-celo-logo.svg",
  44787: "/icons/celo-celo-logo.svg", // celoAlfajores
  8453: "/icons/base-logo-in-blue.svg",
  84532: "/icons/base-logo-in-blue.svg", // baseSepolia
  34443: "/icons/mode-logo.svg",
  919: "/icons/mode-logo.svg", // modeTestnet
};

const NetworkSelector: React.FC = () => {
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
    }
  };

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
              "Available Chains"
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Testnet</SelectLabel>
            {testnets.map((chain) => (
              <SelectItem key={chain.id} value={chain.id.toString()}>
                <img
                  src={chainIcons[chain.id]}
                  alt={chain.name}
                  className="inline-block w-4 h-4 mr-2"
                />
                {chain.name}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Mainnet (Coming Soon)</SelectLabel>
            {mainnets.map((chain) => (
              <SelectItem key={chain.id} value={chain.id.toString()} disabled>
                <img
                  src={chainIcons[chain.id]}
                  alt={chain.name}
                  className="inline-block w-4 h-4 mr-2"
                />
                {chain.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default NetworkSelector;
