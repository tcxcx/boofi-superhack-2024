import React, { useState, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDeezNuts } from "@/hooks/use-peanut";
import PaymentDetails from "./payment-details";
import NetworkSelector from "@/components/chain-network-select"; // Ensure this path is correct
import confetti from "canvas-confetti";
import { toast } from "@/components/ui/use-toast";
import { getLinkDetails } from "@squirrel-labs/peanut-sdk";

interface ExtendedPaymentInfo {
  chainId: number | string;
  tokenSymbol: string;
  tokenAmount: string;
  senderAddress: string;
  claimed: boolean;
  depositDate: string;
  transactionHash?: string;
  depositIndex: number;
}

interface IGetLinkDetailsResponse {
  link: string;
  chainId: string;
  depositIndex: number;
  contractVersion: string;
  password: string;
  sendAddress: string;
  tokenType: string;
  tokenAddress: string;
  tokenDecimals: number;
  tokenSymbol: string;
  TokenName: string;
  tokenAmount: string;
  tokenId: number;
  claimed: boolean;
  depositDate: string;
  tokenURI: string;
}

export default function ClaimForm({
  claimId: initialClaimId,
}: {
  claimId: string | undefined;
}) {
  const {
    truncateHash,
    claimPayLink,
    claimPayLinkXChain,
    isLoading: isPeanutLoading,
  } = useDeezNuts();
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<string | null>(
    null
  );
  const [inputLink, setInputLink] = useState<string>("");
  const [paymentInfo, setPaymentInfo] = useState<ExtendedPaymentInfo | null>(
    null
  );
  const [destinationChainId, setDestinationChainId] = useState<string>(""); // To store selected chain ID
  const [details, setDetails] = useState<IGetLinkDetailsResponse | null>(null);

  const fetchLinkDetails = async (link: string) => {
    try {
      const details = (await getLinkDetails({
        link,
      })) as unknown as IGetLinkDetailsResponse;
      setDetails(details);
      const extendedPaymentInfo: ExtendedPaymentInfo = {
        chainId: details.chainId,
        tokenSymbol: details.tokenSymbol,
        tokenAmount: details.tokenAmount,
        senderAddress: details.sendAddress,
        claimed: details.claimed,
        depositDate: details.depositDate,
        depositIndex: details.depositIndex,
      };
      setPaymentInfo(extendedPaymentInfo);
    } catch (error: any) {
      console.error("Error fetching link details:", error.message);
      toast({
        title: "Error",
        description: "An error occurred while fetching the link details.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (initialClaimId) {
      fetchLinkDetails(initialClaimId);
    }
  }, [initialClaimId]);

  useEffect(() => {
    if (paymentInfo?.claimed) {
      setOverlayVisible(true);
    }
  }, [paymentInfo?.claimed]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputLink(e.target.value);
  };

  const handlePasteClick = async () => {
    const text = await navigator.clipboard.readText();
    setInputLink(text);
  };

  const handleVerify = () => {
    fetchLinkDetails(inputLink);
  };

  const handleSuccess = async () => {
    // Trigger confetti animation
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    // Fetch and update the latest link details
    if (inputLink) {
      await fetchLinkDetails(inputLink);
    }

    // Set the overlay visible
    setOverlayVisible(true);
  };

  const handleClaim = async () => {
    if (paymentInfo?.claimed) {
      toast({
        title: "Already claimed",
        description: "You have already claimed this link.",
      });
    } else if (paymentInfo && !destinationChainId) {
      try {
        const txHash = await claimPayLink(details?.link || "", handleSuccess);
        setTransactionDetails(txHash);
        setPaymentInfo((prevInfo) =>
          prevInfo
            ? { ...prevInfo, transactionHash: txHash, claimed: true }
            : null
        );
      } catch (error) {
        console.error("Error claiming payment link:", error);
      }
    } else if (paymentInfo && destinationChainId) {
      try {
        const txHash = await claimPayLinkXChain(
          details?.link || "",
          destinationChainId,
          details?.tokenAddress || "",
          handleSuccess
        );
        setTransactionDetails(txHash);
        setPaymentInfo((prevInfo) =>
          prevInfo
            ? { ...prevInfo, transactionHash: txHash, claimed: true }
            : null
        );
      } catch (error) {
        console.error("Error claiming cross-chain payment link:", error);
      }
    }
  };

  const handleCloseOverlay = () => {
    setOverlayVisible(false);
  };

  const renderClaimInfo = () => (
    <section className="flex w-full h-auto flex-col justify-between rounded-2xl border bg-background p-5">
      <div className="flex w-full md:h-[200px] lg:h-[300px] flex-col justify-between rounded-2xl">
        <div className="p-5">
          <div className="flex items-center justify-between text-xs w-full">
            <span className="text-xl">💸👻💸</span>
            <span>You are claiming</span>
          </div>
          <div className="text-center flex py-2">
            {paymentInfo && (
              <>
                <PaymentDetails paymentInfo={paymentInfo} />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  const renderInputForm = () => (
    <div className="flex w-full h-auto flex-col justify-between rounded-2xl border bg-background p-5">
      <div className="flex w-full md:h-[200px] lg:h-[300px] flex-col mb-5">
        <label
          htmlFor="claimLink"
          className="text-xs font-semibold font-aeonik"
        >
          Claim your Link Here{" "}
        </label>
        <div className="flex">
          <input
            type="text"
            id="claimLink"
            value={inputLink}
            onChange={handleInputChange}
            className="mt-1 rounded border px-3 py-2 flex-grow"
          />
          <Button onClick={handlePasteClick} className="ml-2">
            Paste
          </Button>
        </div>
      </div>
      <Button
        size={"lg"}
        onClick={handleVerify}
        className="mt-5 flex items-center gap-2 self-end w-full"
        variant={"fito"}
      >
        Verify <span className="text-xl"> 🍸</span>
      </Button>
    </div>
  );

  return (
    <section className="mx-auto h-full flex flex-col items-center">
      {paymentInfo ? renderClaimInfo() : renderInputForm()}
      {paymentInfo && (
        <>
          {!paymentInfo.claimed && (
            <NetworkSelector
              currentChainId={paymentInfo.chainId.toString()} // Pass the currentChainId
              onSelect={(chainId: string) => setDestinationChainId(chainId)} // Ensure chainId is typed as string
            />
          )}
          <Button
            size={"lg"}
            className="mt-5 flex items-center gap-2 self-end w-full"
            onClick={handleClaim}
            variant={"fito"}
            disabled={paymentInfo.claimed || isPeanutLoading}
          >
            Claim
            <span className="text-xl"> 👻</span>
          </Button>
        </>
      )}
      {overlayVisible && (
        <div className="animate-in fade-in-0 fixed inset-0 z-50 bg-white/90">
          <div className="relative flex size-full items-center justify-center">
            <button
              className="absolute right-4 top-4"
              onClick={handleCloseOverlay}
            >
              <span className="size-6">X</span>
            </button>
            <div className="flex flex-col items-center gap-10">
              {isPeanutLoading ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="size-8 animate-spin fill-neutral-600 text-neutral-200 dark:text-neutral-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <div className="flex size-[400px] flex-col justify-between rounded-2xl border bg-white">
                  <div className="p-5">
                    <div className="flex items-center text-xs">
                      <span>Link Claimed Successfully</span>
                    </div>
                    <div className="p-5">
                      {paymentInfo && (
                        <PaymentDetails paymentInfo={paymentInfo} />
                      )}
                    </div>
                  </div>
                  <div className="mt-5 flex h-16 items-center border-t text-xs">
                    <div className="mx-5 flex w-full items-center justify-end">
                      <div className="flex flex-row">
                        <span>View in Blockscout</span>
                        <span className="inline-block ml-1 h-4 w-4">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
