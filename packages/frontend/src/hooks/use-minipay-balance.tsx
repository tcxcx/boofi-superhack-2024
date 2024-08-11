import { useState, useEffect } from "react";
import { createPublicClient, getContract, http, formatEther } from "viem";
import { celoAlfajores, celo } from "viem/chains";
import { useAuthStore } from "@/store/authStore";
import CUSD_ABI from "@/utils/abis/cusd-abi.json";

const isTestnet = process.env.NEXT_PUBLIC_USE_TESTNET === "true";
const chain = isTestnet ? celoAlfajores : celo;
const cUSDTokenAddress = isTestnet
  ? "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"
  : "0x765de816845861e75a25fca122bb6898b8b1282a";

const publicClient = createPublicClient({
  chain: chain,
  transport: http(),
});

const abiMapping: Record<string, any> = {
  CUSD: CUSD_ABI.abi,
};

export const useEnhancedMinipayBalances = () => {
  const { isMiniPay } = useAuthStore();
  const [balances, setBalances] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTokenBalance = async (
    symbol: string,
    tokenAddress: string,
    address: string
  ) => {
    try {
      const formattedAddress = address as `0x${string}`;
      if (symbol === "CELO") {
        const balance = await publicClient.getBalance({
          address: formattedAddress,
        });
        return formatEther(balance);
      } else if (symbol === "CUSD") {
        const contract = getContract({
          abi: abiMapping.CUSD,
          address: tokenAddress as `0x${string}`,
          client: publicClient,
        });
        const balanceBigInt = (await contract.read.balanceOf([
          formattedAddress,
        ])) as bigint;
        return formatEther(balanceBigInt);
      }
      throw new Error(`Unsupported token: ${symbol}`);
    } catch (error: any) {
      console.error(`Failed to fetch balance for ${symbol}:`, error);
      throw error;
    }
  };

  useEffect(() => {
    if (!isMiniPay) return;

    const fetchBalances = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!window.ethereum) {
          throw new Error("Ethereum provider not found");
        }

        const ethereum = window.ethereum as {
          request: (args: { method: string; params?: any[] }) => Promise<any>;
        };

        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        if (!accounts || accounts.length === 0) {
          throw new Error("No accounts found. Please connect your wallet.");
        }
        const address = accounts[0];

        const tokenBalances: { [key: string]: string } = {};

        const tokens = {
          CUSD: cUSDTokenAddress,
          CELO: "0x0000000000000000000000000000000000000000", // CELO native address
        };
        for (const [symbol, tokenAddress] of Object.entries(tokens)) {
          const balance = await fetchTokenBalance(
            symbol,
            tokenAddress,
            address
          );
          tokenBalances[symbol] = balance;
        }

        setBalances(tokenBalances);
      } catch (error: any) {
        console.error("Error fetching balances:", error);
        setError(`Unable to fetch balances: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [isMiniPay]);

  return { balances, error, loading };
};
