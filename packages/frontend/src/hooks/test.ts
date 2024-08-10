import { useCallback, useEffect, useState } from "react";
import peanut, {
  getRandomString,
  interfaces as peanutInterfaces,
  claimLinkGasless,
  claimLinkXChainGasless,
  generateKeysFromString,
  getRawParamsFromLink,
  interfaces,
} from "@squirrel-labs/peanut-sdk";
import {
  useAccount,
  useSendTransaction,
  useSignTypedData,
  useSwitchChain,
  useConfig,
} from "wagmi";
import { createWalletClient, custom, parseEther } from "viem";
import {
  useDynamicContext,
  useUserWallets,
  getNetwork,
} from "@dynamic-labs/sdk-react-core";
import { getChainsForEnvironment } from "@/store/supportedChains";
import { useWindowSize } from "@/hooks/use-window-size";
import { getChain } from "@dynamic-labs/utils";
import { WalletClient, PublicClient } from "viem";
import { useTransactionStore } from "@/store/transactionStore";
import { useToast } from "@/components/ui/use-toast";
import { useLocale } from "next-intl";
import { PEANUT_API_URL } from "@/lib/constants";
import { celo, celoAlfajores } from "viem/chains";
import { useAuthStore } from "@/store/authStore";

const PEANUTAPIKEY = process.env.NEXT_PUBLIC_DEEZ_NUTS_API_KEY;
const next_proxy_url = PEANUT_API_URL;

if (!PEANUTAPIKEY) {
  throw new Error("Peanut API key not found in environment variables");
}

export const useDeezNuts = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isMiniPay } = useAuthStore();
  const [address, setAddress] = useState<string | null>(null);
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);
  const { primaryWallet } = useDynamicContext();
  const userWallets = useUserWallets();
  const { width } = useWindowSize();
  const isMobile = width && width <= 768;
  const { setLoading, setError } = useTransactionStore();
  const { toast } = useToast();
  const locale = useLocale();
  const [crossChainDetails, setCrossChainDetails] = useState<any>([]);

  const generatePassword = async () => {
    try {
      return await getRandomString(16);
    } catch (error) {
      console.log(error);
      throw new Error("Error generating the password.");
    }
  };

  const getChainConfig = (chainId: number) => {
    console.log("getChainConfig - Chain ID:", chainId);
    if (isMiniPay) {
      return process.env.NEXT_PUBLIC_USE_TESTNET === "true"
        ? celoAlfajores
        : celo;
    }
    const supportedChains = getChainsForEnvironment();
    const chainConfig = supportedChains.find((c) => c.id === chainId);
    if (!chainConfig) {
      throw new Error(`Chain ID ${chainId} not supported yet`);
    }
    return chainConfig;
  };

  const getUserAddress = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      const chainConfig = getChainConfig(currentChainId || 44787);
      let walletClient = createWalletClient({
        transport: custom(window.ethereum),
        chain: chainConfig,
      });

      let [address] = await walletClient.getAddresses();
      setAddress(address);
      return address;
    }
    return null;
  };

  const waitForTransactionReceipt = async (
    client: PublicClient,
    txHash: `0x${string}`,
    timeout = 60000
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const unwatch = client.watchBlockNumber({
        onBlockNumber: async (blockNumber) => {
          try {
            const receipt = await client.getTransactionReceipt({
              hash: txHash,
            });
            if (receipt) {
              unwatch();
              resolve(receipt);
            } else if (Date.now() - startTime > timeout) {
              unwatch();
              reject(
                new Error(
                  `Transaction ${txHash} was not mined within ${
                    timeout / 1000
                  } seconds`
                )
              );
            }
          } catch (error) {
            console.error("Error checking transaction receipt:", error);
          }
        },
        emitOnBegin: true,
      });
    });
  };

  const getTokenDetails = (tokenAddress: string, chainId: number | string) => {
    if (tokenAddress === "0x0000000000000000000000000000000000000000") {
      return { tokenType: 0, tokenDecimals: 18 }; // Native token (e.g., ETH)
    } else {
      return { tokenType: 1, tokenDecimals: 18 }; // ERC20 token (assuming 18 decimals)
    }
  };

  const generateLinkDetails = useCallback(
    ({
      tokenValue,
      tokenAddress,
    }: {
      tokenValue: string;
      tokenAddress: string;
    }) => {
      try {
        const tokenDetails = getTokenDetails(
          tokenAddress,
          currentChainId || ""
        );
        const baseUrl = `${window.location.origin}/${locale}/claim`;

        const linkDetails: peanutInterfaces.IPeanutLinkDetails = {
          chainId: currentChainId?.toString() || "",
          tokenAmount: parseFloat(Number(tokenValue).toFixed(6)),
          tokenType: tokenDetails.tokenType,
          tokenAddress: tokenAddress,
          tokenDecimals: tokenDetails.tokenDecimals,
          baseUrl: baseUrl,
          trackId: "ui",
        };

        return linkDetails;
      } catch (error) {
        console.log(error);
        throw new Error("Error getting the linkDetails.");
      }
    },
    [currentChainId, locale]
  );

  const prepareDepositTxs = useCallback(
    async ({
      _linkDetails,
      _password,
    }: {
      _linkDetails: peanutInterfaces.IPeanutLinkDetails;
      _password: string;
    }) => {
      try {
        let userAddress: `0x${string}`;

        if (isMiniPay && isMobile && window.ethereum) {
          const address = await getUserAddress();
          if (!address || !address.startsWith("0x")) {
            throw new Error("Invalid or unavailable user address for MiniPay.");
          }
          userAddress = address as `0x${string}`;
        } else if (primaryWallet && primaryWallet.address) {
          userAddress = primaryWallet.address as `0x${string}`;
        } else {
          throw new Error("Invalid or unavailable primary wallet address.");
        }

        const prepareTxsResponse = await peanut.prepareTxs({
          address: userAddress,
          linkDetails: _linkDetails,
          passwords: [_password],
        });

        return prepareTxsResponse;
      } catch (error) {
        console.error("Error in prepareDepositTxs:", error);
        throw error;
      }
    },
    [isMiniPay, isMobile, getUserAddress, primaryWallet]
  );

  const createPayLink = async (
    amount: string,
    tokenAddress: string,
    onInProgress?: () => void,
    onSuccess?: () => void,
    onFailed?: (error: Error) => void,
    onFinished?: () => void,
    isMultiChain: boolean = false,
    destinationChainId?: string
  ) => {
    setIsLoading(true);
    try {
      if (!currentChainId) {
        throw new Error(
          "Chain ID is not set. Please ensure the wallet is connected and the network is selected."
        );
      }

      const chainConfig = getChainConfig(currentChainId);

      const linkDetails = generateLinkDetails({
        tokenValue: amount,
        tokenAddress,
      });

      const password = await generatePassword();

      if (isMobile && isMiniPay) {
        if (!window.ethereum) {
          throw new Error("Ethereum provider not found");
        }

        const userAddress = await getUserAddress();
        if (!userAddress) {
          throw new Error(
            "User address is not available. Make sure the user is connected."
          );
        }

        const walletClient = createWalletClient({
          transport: custom(window.ethereum),
          chain: chainConfig,
        });

        const preparedTransactions = await prepareDepositTxs({
          _linkDetails: linkDetails,
          _password: password,
        });

        const transactionHashes: string[] = [];

        for (const unsignedTx of preparedTransactions.unsignedTxs) {
          const txValue = unsignedTx.value
            ? BigInt(unsignedTx.value.toString())
            : undefined;
          const txHash = await walletClient.sendTransaction({
            account: userAddress as `0x${string}`,
            to: unsignedTx.to as `0x${string}`,
            data: unsignedTx.data as `0x${string}`,
            value: txValue && txValue > BigInt(0) ? txValue : undefined,
          });

          transactionHashes.push(txHash);
          onInProgress?.();
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
      } else {
        if (!primaryWallet) throw new Error("No primary wallet found");

        const provider =
          (await primaryWallet.connector.getSigner()) as WalletClient;
        if (!provider) throw new Error("No signer found");

        if (!primaryWallet.address) {
          throw new Error(
            "User address is not available. Make sure the user is connected."
          );
        }

        const preparedTransactions = await prepareDepositTxs({
          _linkDetails: linkDetails,
          _password: password,
        });

        const transactionHashes: string[] = [];

        for (const unsignedTx of preparedTransactions.unsignedTxs) {
          const txHash = await provider.sendTransaction({
            account: primaryWallet.address as `0x${string}`,
            to: unsignedTx.to as `0x${string}`,
            data: unsignedTx.data as `0x${string}`,
            value: unsignedTx.value
              ? BigInt(unsignedTx.value.toString())
              : undefined,
            chain: getChain(chainConfig.id),
          });
          transactionHashes.push(txHash);
          onInProgress?.();
        }

        toast({
          title: "Transaction sent",
          description: `Transaction hash: ${
            transactionHashes[transactionHashes.length - 1]
          }. Waiting for confirmation...`,
        });

        const client =
          (await primaryWallet.connector.getPublicClient()) as PublicClient;

        try {
          const receipt = await waitForTransactionReceipt(
            client,
            transactionHashes[transactionHashes.length - 1] as `0x${string}`
          );

          const { links } = await peanut.getLinksFromTx({
            linkDetails: linkDetails,
            passwords: [password],
            txHash: receipt.transactionHash,
          });

          toast({
            title: "Link created successfully",
            description: "Your payment link has been created.",
          });

          onSuccess?.();
          return {
            transactionHash: receipt.transactionHash,
            paymentLink: links[0],
          };
        } catch (error: any) {
          console.error("Error waiting for transaction receipt:", error);
          toast({
            title: "Transaction sent",
            description: `Your transaction was sent with hash ${
              transactionHashes[transactionHashes.length - 1]
            }`,
            variant: "default",
          });
          onFailed?.(error);
          return {
            transactionHash: transactionHashes[transactionHashes.length - 1],
            paymentLink: null,
          };
        }
      }
    } catch (error: any) {
      console.error("Error creating paylink:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      toast({
        title: "Error creating link",
        description: errorMessage,
        variant: "destructive",
      });
      onFailed?.(error);
      throw error;
    } finally {
      setLoading(false);
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
    setError(null);

    try {
      if (isMobile && isMiniPay) {
        if (!window.ethereum) {
          throw new Error("Ethereum provider not found");
        }

        const userAddress = await getUserAddress();
        if (!userAddress) {
          throw new Error(
            "User address is not available. Make sure the user is connected."
          );
        }
        const claimedLinkResponse = await claimLinkGasless({
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
      } else {
        if (
          !primaryWallet ||
          !primaryWallet.address ||
          !primaryWallet.address.startsWith("0x")
        ) {
          throw new Error(
            "Invalid or unavailable primary wallet address. Please connect your wallet."
          );
        }
        let userAddress = primaryWallet.address as `0x${string}`;

        if (!primaryWallet) {
          console.error("No primary wallet found");
          throw new Error("No primary wallet found");
        }

        const provider =
          (await primaryWallet.connector.getSigner()) as WalletClient;
        if (!provider) throw new Error("No signer found");

        const claimedLinkResponse = await claimLinkGasless({
          link,
          APIKey: PEANUTAPIKEY,
          recipientAddress: userAddress as `0x${string}`,
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
      }
    } catch (error: any) {
      console.error("Error claiming paylink:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      toast({
        title: "Error claiming link",
        description: errorMessage,
        variant: "destructive",
      });
      onFailed?.(error);
      throw error;
    } finally {
      setLoading(false);
      onFinished?.();
    }
  };

  const claimPayLinkXChain = async (
    link: string,
    destinationChainId: string,
    destinationToken: string,
    onInProgress?: () => void,
    onSuccess?: () => void,
    onFailed?: (error: Error) => void,
    onFinished?: () => void
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const userAddress =
        isMobile && isMiniPay ? await getUserAddress() : primaryWallet?.address;

      if (!userAddress) {
        throw new Error(
          "User address is not available. Make sure the user is connected."
        );
      }

      const claimedLinkResponse = await claimLinkXChainGasless({
        link,
        APIKey: PEANUTAPIKEY,
        recipientAddress: userAddress as `0x${string}`,
        destinationChainId, // id of a supported destination chain.
        destinationToken, // optional. address of the token on the destination chain, 0x00..00 for native token. If not specified, the address of the token on the source chain is used.
        isMainnet: true,
        slippage: 1,
      });

      console.log(claimedLinkResponse.txHash);
      toast({
        title: "Cross-chain transaction sent",
        description: `Your transaction was claimed with hash ${claimedLinkResponse.txHash}. This may take a few minutes to confirm.`,
        variant: "default",
      });
      onInProgress?.();
      onSuccess?.();

      return claimedLinkResponse.txHash;
    } catch (error: any) {
      console.error("Error claiming cross-chain paylink:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      toast({
        title: "Error claiming cross-chain link",
        description: errorMessage,
        variant: "destructive",
      });
      onFailed?.(error);
      throw error;
    } finally {
      setLoading(false);
      onFinished?.();
    }
  };

  const copyToClipboard = (link: string) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast({
          title: "Link copied",
          description: "The link has been copied to your clipboard.",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Failed to copy",
          description: "An error occurred while copying the link.",
          variant: "destructive",
        });
      });
  };
  const truncateHash = useCallback(
    (hash: string | undefined | null): string => {
      if (!hash) return "";
      if (hash.length > 10) {
        return `${hash.slice(0, 7)}...${hash.slice(-4)}`;
      }
      return hash;
    },
    []
  );

  return {
    isLoading,
    isMiniPay,
    isMobile,
    currentChainId,
    address,
    createPayLink,
    claimPayLinkXChain,
    claimPayLink,
    copyToClipboard,
    truncateHash,
    getUserAddress,
  };
};
