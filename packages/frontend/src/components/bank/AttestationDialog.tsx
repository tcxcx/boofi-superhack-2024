import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog-z";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/ui/spinner";
import {
  updateAttestationStep,
  getUnfinishedAttestationWithWorldIdValid,
} from "@/lib/actions/attestation.actions";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useCreateAttestation } from "@/hooks/use-attestation-creation";
import { WorldIdVerification } from "@/components/dynamic-content/WorldIdVerification";
import { useAttestationStore } from "@/store/attestationStore";

export function AttestationDialog({ buttonText = "Get Credit Score" }) {
  const {
    open,
    currentStep,
    isConsentChecked,
    isVerified,
    isLoading,
    creditScore,
    attestationUrl,
    errorMessage,
    isWorldIdVerifying,
    setOpen,
    setCurrentStep,
    setIsConsentChecked,
    setIsVerified,
    setIsLoading,
    setCreditScore,
    setAttestationUrl,
    setErrorMessage,
    setIsWorldIdVerifying,
    reset,
    easGrade,
    totalAttested,
    maxLoanAmount,
    setEasGrade,
    setTotalAttested,
    setMaxLoanAmount,
  } = useAttestationStore();

  const { user } = useDynamicContext();
  const {
    createAttestation,
    isLoading: isEASLoading,
    error: easError,
  } = useCreateAttestation();

  useEffect(() => {
    if (user && open) {
      loadAttestationStatus();
    }
  }, [user, open]);

  const loadAttestationStatus = useCallback(async () => {
    if (user?.userId) {
      try {
        const response = await fetch("/api/eas/attestation-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.userId,
            action: "getUnfinishedAttestationWithWorldIdValid",
          }),
        });
        const attestation = await response.json();
        if (attestation && attestation.world_id_valid) {
          setIsVerified(true);
          setCurrentStep(getStepFromStatus(attestation));
        }
      } catch (error) {
        console.error("Error loading attestation status:", error);
      }
    }
  }, [user?.userId]);

  const handleConsentChange = () => {
    setIsConsentChecked(!isConsentChecked);
  };

  const handleNextStep = async () => {
    if (user?.userId) {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await fetch("/api/eas/attestation-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.userId,
            action: "updateStep",
            step: "consent",
            data: { consent: isConsentChecked },
          }),
        });
        const updatedStatus = await response.json();
        if (updatedStatus.consent) {
          setCurrentStep(2);
        } else {
          setErrorMessage("Failed to update consent. Please try again.");
        }
      } catch (error) {
        console.error("Error updating consent:", error);
        setErrorMessage("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getStepFromStatus = (status: any) => {
    if (status.attestation_status) return 4;
    if (status.world_id_valid) return 3;
    if (status.consent) return 2;
    return 1;
  };

  const handleWorldIdVerificationSuccess = async () => {
    if (user?.userId) {
      setIsLoading(true);
      try {
        const updatedStatus = await updateAttestationStep(
          user.userId,
          "worldId",
          {
            world_id_valid: true,
          }
        );
        setIsVerified(true);
        setCurrentStep(getStepFromStatus(updatedStatus));
      } catch (error) {
        console.error("Error updating WorldID verification:", error);
      } finally {
        setIsLoading(false);
        setIsWorldIdVerifying(false);
      }
    }
  };

  const handleWorldIdVerificationFailure = () => {
    console.error("World ID verification failed");
    setIsWorldIdVerifying(false);
    setErrorMessage("World ID verification failed. Please try again.");
  };

  const handleEASAttestation = async () => {
    if (user?.userId) {
      setIsLoading(true);
      try {
        console.log("Creating attestation data");
        console.log("User ID:", user.userId);

        const result = await createAttestation();

        if (result && result.attestationUID) {
          const response = await fetch("/api/eas/attestation-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.userId,
              action: "updateStep",
              step: "eas",
              data: {
                attestation_status: true,
                eas_contract_url: result.attestationUrl,
                eas_score: result.easScore,
                eas_grade: result.easGrade,
                total_attested: result.totalAttested,
                max_loan_amount: result.maxLoanAmount,
              },
            }),
          });

          const updatedStatus = await response.json();
          setCreditScore(updatedStatus.eas_score || null);
          setEasGrade(updatedStatus.eas_grade || null);
          setTotalAttested(updatedStatus.total_attested || null);
          setMaxLoanAmount(updatedStatus.max_loan_amount || null);
          setAttestationUrl(result.attestationUrl);
          setCurrentStep(4);
        }
      } catch (error) {
        console.error("Error creating EAS attestation:", error);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "An error occurred during attestation creation"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      if (currentStep === 4) {
        reset();
      }
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Financial Statement Attestation</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="flex items-center justify-center gap-4 mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  currentStep >= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step}
              </div>
            ))}
          </div>

          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Consent and Information</h2>
              <p className="text-sm">
                To obtain your financial attestation, we need your consent to
                access your credit information. This process is essential for
                evaluating your creditworthiness and determining potential loan
                amounts.
              </p>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consent"
                  checked={isConsentChecked}
                  onCheckedChange={handleConsentChange}
                  disabled={isLoading}
                />
                <Label htmlFor="consent">
                  I understand and consent to the credit check process.
                </Label>
              </div>
              <Button
                disabled={!isConsentChecked || isLoading}
                onClick={handleNextStep}
                className="w-full"
              >
                {isLoading ? <Spinner /> : "Next"}
              </Button>
              {errorMessage && (
                <p className="text-sm text-red-600 text-center mt-2">
                  {errorMessage}
                </p>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              {!isVerified && !isWorldIdVerifying && (
                <WorldIdVerification
                  userId={user?.userId || ""}
                  onVerified={handleWorldIdVerificationSuccess}
                  onFailed={handleWorldIdVerificationFailure}
                />
              )}

              <h2 className="text-lg font-semibold">Identity Verification</h2>
              <p className="text-sm">
                To ensure the integrity of the attestation process, we use
                WorldID to verify your identity. This Sybil-resistant
                verification helps us confirm that you are a unique individual
                and prevent fraudulent activities.
              </p>

              {isWorldIdVerifying && (
                <p className="text-sm text-center">
                  Verification in progress...
                </p>
              )}
              {isVerified && (
                <p className="text-sm text-green-600 text-center">
                  Identity verified successfully!
                </p>
              )}
              <Button
                onClick={() => setCurrentStep(3)}
                className="w-full"
                disabled={!isVerified || isLoading}
              >
                {isLoading ? <Spinner /> : "Next"}
              </Button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              {isEASLoading || isLoading ? (
                <>
                  <h2 className="text-lg font-semibold">
                    Processing Attestation...
                  </h2>
                  <p className="text-sm text-center">
                    We're creating your on-chain attestation. This may take a
                    moment, please wait.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold">
                    Begin Your Credit Attestation
                  </h2>
                  <p className="text-sm text-center">
                    BooFi will start processing your credit score and create
                    your on-chain attestation.
                  </p>
                </>
              )}
              <Button
                onClick={handleEASAttestation}
                className="w-full"
                disabled={isEASLoading || isLoading}
              >
                {isEASLoading || isLoading ? (
                  <Spinner />
                ) : (
                  "Create On-Chain Attestation"
                )}
              </Button>
              {easError && (
                <p className="text-sm text-red-600 text-center mt-2">
                  {easError}
                </p>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                Private Attestation Result
              </h2>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">
                  {creditScore} 👻
                </p>
                <p className="mt-2 text-sm">
                  Your credit score falls within the "{easGrade}" range,
                  indicating
                  {easGrade === "Excellent" ||
                  easGrade === "Good" ||
                  easGrade === "Bad" ||
                  easGrade === "Very Poor"
                    ? " strong"
                    : " moderate"}{" "}
                  creditworthiness. Based on this, you may be eligible for loan
                  amounts up to ${maxLoanAmount}. Your total attested value is $
                  {totalAttested}.
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (attestationUrl) {
                      window.open(attestationUrl, "_blank");
                    } else {
                      console.error("Attestation URL is not available");
                      setErrorMessage(
                        "Unable to retrieve the attestation URL. Please try again later."
                      );
                    }
                  }}
                >
                  Verify on EAS
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    const tweetText = `I just received a financial attestation with a credit score of ${creditScore}! #DeFi #Attestation`;
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        tweetText
                      )}`,
                      "_blank"
                    );
                  }}
                >
                  Share on Twitter
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
