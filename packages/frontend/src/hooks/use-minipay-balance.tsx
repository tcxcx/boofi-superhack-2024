import { useState, useEffect } from "react";
import { createPublicClient, getContract, http, formatEther } from "viem";
import { celo, celoAlfajores } from "viem/chains";
import { useAuthStore } from "@/store/authStore";
import { currencyAddresses } from "@/utils/currencyAddresses";
import CUSD_ABI from "@/utils/abis/cusd-abi.json";

// Map ABIs for tokens (e.g., CUSD)
const abiMapping: Record<string, any> = {
  CUSD: CUSD_ABI.abi,
};

const getPublicClient = (isMiniPay: boolean) => {
  const chain = isMiniPay ? celoAlfajores : celo;
  return createPublicClient({
    chain,
    transport: http(),
  });
};

export const useEnhancedMinipayBalances = () => {
  const { isMiniPay } = useAuthStore();
  const [balances, setBalances] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const publicClient = getPublicClient(isMiniPay);

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

        const chainId = isMiniPay ? celo.id : celoAlfajores.id;
        const tokens = currencyAddresses[chainId];
        for (const [symbol, tokenAddress] of Object.entries(tokens)) {
          if (symbol === "CUSD" || symbol === "CELO") {
            const balance = await fetchTokenBalance(
              symbol,
              tokenAddress,
              address
            );
            tokenBalances[symbol] = balance;
          }
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
