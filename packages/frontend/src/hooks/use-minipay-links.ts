import { useCallback, useState } from "react";
import peanut, {
  getRandomString,
  interfaces as peanutInterfaces,
} from "@squirrel-labs/peanut-sdk";
import { createWalletClient, custom } from "viem";
import { useWindowSize } from "@/hooks/use-window-size";
import { useToast } from "@/components/ui/use-toast";
import { celo, celoAlfajores } from "viem/chains";
import { useAuthStore } from "@/store/authStore";

const isTestnet = process.env.NEXT_PUBLIC_USE_TESTNET === "true";
const chain = isTestnet ? celoAlfajores : celo;
const cUSDTokenAddress = isTestnet
  ? "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"
  : "0x765de816845861e75a25fca122bb6898b8b1282a";

const PEANUTAPIKEY = process.env.NEXT_PUBLIC_DEEZ_NUTS_API_KEY;

if (!PEANUTAPIKEY) {
  throw new Error("Peanut API key not found in environment variables");
}

export const useMiniPayDeezNuts = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isMiniPay } = useAuthStore();
  const { width } = useWindowSize();
  const isMobile = width && width <= 768;
  const { toast } = useToast();

  const generatePassword = async () => {
    try {
      return await getRandomString(16);
    } catch (error) {
      console.error(error);
      throw new Error("Error generating the password.");
    }
  };

  const getUserAddress = async (): Promise<string | null> => {
    if (typeof window !== "undefined" && window.ethereum) {
      const walletClient = createWalletClient({
        transport: custom(window.ethereum as any),
        chain: chain,
      });

      const currentChainId = await walletClient.getChainId();
      if (currentChainId !== chain.id) {
        try {
          await walletClient.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${chain.id.toString(16)}` }],
          });
        } catch (error) {
          console.error("Failed to switch the chain", error);
          throw new Error(
            "Failed to switch the chain. Please switch it manually."
          );
        }
      }

      const [address] = await walletClient.getAddresses();
      return address || null;
    }
    return null;
  };

  const prepareDepositTxs = useCallback(
    async ({
      _linkDetails,
      _password,
    }: {
      _linkDetails: peanutInterfaces.IPeanutLinkDetails;
      _password: string;
    }) => {
      try {
        const address = await getUserAddress();
        if (!address || !address.startsWith("0x")) {
          throw new Error("Invalid or unavailable user address for MiniPay.");
        }

        const prepareTxsResponse = await peanut.prepareTxs({
          address: address as `0x${string}`,
          linkDetails: _linkDetails,
          passwords: [_password],
        });

        return prepareTxsResponse;
      } catch (error) {
        console.error("Error in prepareDepositTxs:", error);
        throw error;
      }
    },
    [getUserAddress]
  );

  const createPayLink = async (
    amount: string,
    tokenAddress: string,
    onInProgress?: () => void,
    onSuccess?: () => void,
    onFailed?: (error: Error) => void,
    onFinished?: () => void
  ) => {
    setIsLoading(true);
    try {
      const linkDetails = {
        chainId: chain.id.toString(),
        tokenAmount: parseFloat(Number(amount).toFixed(6)),
        tokenType: 1,
        tokenAddress: tokenAddress,
        tokenDecimals: 18,
        baseUrl: `${window.location.origin}/claim`,
        trackId: "ui",
      };

      const password = await generatePassword();

      const userAddress = await getUserAddress();
      if (!userAddress) {
        throw new Error(
          "User address is not available. Make sure the user is connected."
        );
      }

      const walletClient = createWalletClient({
        transport: custom(window.ethereum as any),
        chain: chain,
      });

      const preparedTransactions = await prepareDepositTxs({
        _linkDetails: linkDetails,
        _password: password,
      });

      const transactionHashes: string[] = [];

      for (const unsignedTx of preparedTransactions.unsignedTxs) {
        const txHash = await walletClient.sendTransaction({
          account: userAddress as `0x${string}`,
          to: unsignedTx.to as `0x${string}`,
          data: unsignedTx.data as `0x${string}`,
        });

        transactionHashes.push(txHash);
      }

      const { links } = await peanut.getLinksFromTx({
        linkDetails: linkDetails,
        passwords: [password],
        txHash: transactionHashes[
          transactionHashes.length - 1
        ] as `0x${string}`,
      });

      toast({
        title: "Link created successfully",
        description: "Your payment link has been created.",
      });
      onSuccess?.();
      return {
        transactionHash: transactionHashes[transactionHashes.length - 1],
        paymentLink: links[0],
      };
    } catch (error: any) {
      console.error("Error creating paylink:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast({
        title: "Error creating link",
        description: errorMessage,
        variant: "destructive",
      });
      onFailed?.(error);
      throw error;
    } finally {
      setIsLoading(false);
      onFinished?.();
    }
  };

  const claimPayLink = async (
    link: string,
    onInProgress?: () => void,
    onSuccess?: () => void,
    onFailed?: (error: Error) => void,
    onFinished?: () => void
  ) => {
    setIsLoading(true);
    try {
      const userAddress = await getUserAddress();
      if (!userAddress) {
        throw new Error(
          "User address is not available. Make sure the user is connected."
        );
      }
      const claimedLinkResponse = await peanut.claimLinkGasless({
        link,
        APIKey: PEANUTAPIKEY,
        recipientAddress: userAddress as `0x${string}`,
        baseUrl: `https://api.peanut.to/claim-v2`,
      });
      console.log(claimedLinkResponse.txHash);
      toast({
        title: "Transaction sent, but not yet confirmed",
        description: `Your transaction was claimed with hash ${claimedLinkResponse.txHash}. This may take a few minutes to confirm.`,
        variant: "default",
      });
      onInProgress?.();
      onSuccess?.();
      return (
        claimedLinkResponse.transactionHash ??
        claimedLinkResponse.txHash ??
        claimedLinkResponse.hash ??
        claimedLinkResponse.tx_hash ??
        null
      );
    } catch (error: any) {
      console.error("Error claiming paylink:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast({
        title: "Error claiming link",
        description: errorMessage,
        variant: "destructive",
      });
      onFailed?.(error);
      throw error;
    } finally {
      setIsLoading(false);
      onFinished?.();
    }
  };

  return {
    isLoading,
    createPayLink,
    claimPayLink,
  };
};
