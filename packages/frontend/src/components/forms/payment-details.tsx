import React, { useState } from "react";
import { useDeezNuts } from "@/hooks/use-peanut";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import { ChevronRightIcon, CopyIcon } from "lucide-react";
import { getBlockExplorerUrlByChainId } from "@/utils/index";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import NetworkSelector from "@/components/chain-network-select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Props {
  paymentInfo: {
    chainId: number | string;
    tokenSymbol: string;
    tokenAmount: string;
    senderAddress: string;
    claimed: boolean;
    depositDate: string;
    transactionHash?: string;
  };
}

const chainIdMapping: { [key: number]: string } = {
  84532: "Base Sepolia",
  1: "Ethereum",
  11155111: "Sepolia",
  10: "Optimism",
  11155420: "Optimism Sepolia",
  42220: "Celo",
  44787: "Celo Alfajores",
  8453: "Base",
  34443: "Mode",
  919: "Mode Testnet",
};

const chainIcons: { [key: number]: string } = {
  1: "/icons/ethereum-eth-logo.svg",
  11155111: "/icons/ethereum-eth-logo.svg",
  10: "/icons/optimism-ethereum-op-logo.svg",
  11155420: "/icons/optimism-ethereum-op-logo.svg",
  42220: "/icons/celo-celo-logo.svg",
  8453: "/icons/base-logo-in-blue.svg",
  84532: "/icons/base-logo-in-blue.svg",
  34443: "/icons/mode-logo.svg",
  919: "/icons/mode-logo.svg",
};

export const getTokenIcon = (token: string, chainId: number): string => {
  switch (token.toUpperCase()) {
    case "USDC":
      return "/icons/usdc.svg";
    case "DAI":
      return "/icons/dai.svg";
    case "USDT":
      return "/icons/usdt.svg";
    case "CUSD":
      return "/icons/celo-dollar_large.webp";
    case "ETH":
      return chainIcons[chainId] || "/icons/ethereum-eth-logo.svg";
    default:
      return "/icons/default-token.svg";
  }
};

const PaymentDetails: React.FC<Props> = ({ paymentInfo }) => {
  const { truncateHash } = useDeezNuts();
  const { toast } = useToast();
  const [isMultiChain, setIsMultiChain] = useState(false);

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
  };

  const chainName =
    chainIdMapping[Number(paymentInfo.chainId)] ||
    `Chain ${paymentInfo.chainId}`;

  const handleCopy = (text: string, label: string) => {
    copyToClipboard(text.toLowerCase());
    toast({
      title: "Copied to clipboard!",
      description: `${label} has been copied to clipboard.`,
      action: <ToastAction altText="Spooky">👻</ToastAction>,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md py-6 grid gap-6 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <div className="bg-muted rounded-md flex items-center justify-center aspect-square w-12">
            <Image
              src={getTokenIcon(
                paymentInfo.tokenSymbol,
                Number(paymentInfo.chainId)
              )}
              width={24}
              height={24}
              priority
              alt={`${paymentInfo.tokenSymbol} Logo`}
              className="aspect-square object-contain"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold">
              {paymentInfo.tokenSymbol}
            </h3>
            <p className="text-muted-foreground text-xs">{chainName}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{paymentInfo.tokenAmount} 👻</p>
          </div>
        </div>
        <div className="grid gap-2 text-xs">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">From:</p>
            <Button
              variant="link"
              className="p-0 h-auto font-medium hover:bg-transparent"
              onClick={() =>
                handleCopy(paymentInfo.senderAddress, "Sender Address")
              }
            >
              {truncateHash(paymentInfo.senderAddress)}
              <CopyIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Status:</p>
            <Badge
              className="text-xs"
              variant={paymentInfo.claimed ? "default" : "secondary"}
            >
              {paymentInfo.claimed ? "Claimed" : "Unclaimed"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Deposit Date:</p>
            <p className="font-medium text-sm">
              {new Date(paymentInfo.depositDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {!paymentInfo.claimed && (
          <div className="flex items-center justify-end p-4 space-x-2">
            <Switch
              id="multi-chain-link"
              checked={isMultiChain}
              onCheckedChange={() => setIsMultiChain(!isMultiChain)}
            />
            <Label htmlFor="multi-chain-link" className="text-xs">
              Multi-Chain
            </Label>
          </div>
        )}

        {isMultiChain && (
          <div className="mt-4 flex h-16 items-center border-t text-xs">
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col w-full">
                <span className="inline-block font-semibold">
                  Select Destination Chain
                </span>
                <NetworkSelector
                  currentChainId={paymentInfo.chainId.toString()}
                />
              </div>
            </div>
          </div>
        )}

        {paymentInfo.transactionHash && (
          <div className="flex justify-end">
            <Link
              href={`${getBlockExplorerUrlByChainId(
                Number(paymentInfo.chainId)
              )}/tx/${paymentInfo.transactionHash}`}
              className="text-sm text-primary hover:underline"
              target="_blank"
            >
              View in Blockscout
              <ChevronRightIcon className="inline-block ml-1 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PaymentDetails;
