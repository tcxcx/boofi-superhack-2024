import { useState, useEffect } from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  getContract,
  http,
} from "viem";
import { celoAlfajores } from "viem/chains";
import { useAuthStore } from "@/store/authStore";
import { currencyAddresses } from "@/utils/currencyAddresses";
import CUSD_ABI from "@/utils/abis/cusd-abi.json";
import USDC_ABI from "@/utils/abis/usdc-abi-celo.json";
import CELO_ABI from "@/utils/abis/celo-abi.json";
import CEUR_ABI from "@/utils/abis/ceur-abi.json";

const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http(),
});

export const useMinipayBalances = () => {
  const { isMiniPay } = useAuthStore();
  const [balances, setBalances] = useState<{ [key: string]: string | null }>(
    {}
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!isMiniPay) return;

      try {
        const walletClient = createWalletClient({
          transport: custom(window.ethereum as any),
          chain: celoAlfajores,
        });

        const [address] = await walletClient.getAddresses();
        if (!address) throw new Error("Unable to retrieve address.");

        const tokenBalances: { [key: string]: string | null } = {};

        const tokens = currencyAddresses[celoAlfajores.id];
        for (const [symbol, tokenAddress] of Object.entries(tokens)) {
          let abi;
          switch (symbol) {
            case "CUSD":
              abi = CUSD_ABI.abi;
              break;
            case "USDC":
              abi = USDC_ABI;
              break;
            case "CELO":
              abi = CELO_ABI;
              break;
            case "CEUR":
              abi = CEUR_ABI;
              break;
            default:
              continue; // Skip unknown tokens
          }

          const contract = getContract({
            abi,
            address: tokenAddress as `0x${string}`,
            client: publicClient,
          });

          const balanceBigInt = (await contract.read.balanceOf([
            address,
          ])) as bigint;

          let balanceStr = balanceBigInt.toString();

          if (balanceStr.length > 18) {
            const wholePart = balanceStr.slice(0, balanceStr.length - 18);
            const decimalPart = balanceStr.slice(
              balanceStr.length - 18,
              balanceStr.length - 16
            );
            balanceStr = `${wholePart}.${decimalPart}`;
          } else {
            balanceStr = `0.${balanceStr.padStart(18, "0").slice(0, 2)}`;
          }

          tokenBalances[symbol] = balanceStr;
        }

        setBalances(tokenBalances);
      } catch (error) {
        console.error("Error fetching balances:", error);
        setError("Unable to fetch balances.");
      }
    };

    fetchBalances();
  }, [isMiniPay]);

  return { balances, error };
};
