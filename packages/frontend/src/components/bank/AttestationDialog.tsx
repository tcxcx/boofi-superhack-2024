import { useState, useEffect } from "react";
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
  getAttestationStatus,
} from "@/lib/actions/attestation.actions";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import useCreateAttestation from "@/hooks/use-attestation-creation";

export function AttestationDialog({ buttonText = "Get Credit Score" }) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isConsentChecked, setIsConsentChecked] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const { user } = useDynamicContext();
  const {
    createAttestation,
    isLoading: isEASLoading,
    error: easError,
    attestationUID,
  } = useCreateAttestation();

  useEffect(() => {
    if (user && open) {
      loadAttestationStatus();
    }
  }, [user, open]);

  const loadAttestationStatus = async () => {
    if (user?.userId) {
      const status = await getAttestationStatus(user.userId);
      if (status) {
        setIsConsentChecked(status.consent || false);
        setIsVerified(status.world_id_valid || false);
        setCreditScore(status.eas_score || null);
        setCurrentStep(getStepFromStatus(status));
      }
    }
  };

  const getStepFromStatus = (status: any) => {
    if (status.attestation_status) return 4;
    if (status.world_id_valid) return 3;
    if (status.consent) return 2;
    return 1;
  };

  const handleConsentChange = async () => {
    if (user?.userId) {
      setIsLoading(true);
      try {
        await updateAttestationStep(user.userId, "consent", {
          consent: !isConsentChecked,
        });
        setIsConsentChecked(!isConsentChecked);
      } catch (error) {
        console.error("Error updating consent:", error);
      }
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (user?.userId) {
      setIsLoading(true);
      try {
        await updateAttestationStep(user.userId, "worldId", {
          world_id_valid: true,
        });
        setIsVerified(true);
        setCurrentStep(3);
      } catch (error) {
        console.error("Error updating WorldID verification:", error);
      }
      setIsLoading(false);
    }
  };

  const handleEASAttestation = async () => {
    if (user?.userId) {
      setIsLoading(true);
      try {
        await createAttestation();
        if (attestationUID) {
          const updatedStatus = await updateAttestationStep(
            user.userId,
            "eas",
            {
              attestation_status: true,
              eas_contract_url: attestationUID,
              eas_score: 780, // This should be calculated based on actual data
              eas_grade: "Good",
              total_attested: "50000", // This should be calculated based on actual data
              max_loan_amount: "35000", // This should be calculated based on actual data
            }
          );
          setCreditScore(updatedStatus.eas_score || null);
          setCurrentStep(4);
        }
      } catch (error) {
        console.error("Error creating EAS attestation:", error);
      }
      setIsLoading(false);
    }
  };

  const resetDialog = () => {
    setCurrentStep(1);
    setIsConsentChecked(false);
    setIsVerified(false);
    setIsLoading(false);
    setCreditScore(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetDialog();
    }
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
                onClick={() => setCurrentStep(2)}
                className="w-full"
              >
                {isLoading ? <Spinner /> : "Next"}
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Identity Verification</h2>
              <p className="text-sm">
                To ensure the integrity of the attestation process, we use
                WorldID to verify your identity. This Sybil-resistant
                verification helps us confirm that you are a unique individual
                and prevent fraudulent activities.
              </p>
              <Button
                onClick={handleVerify}
                className="w-full"
                disabled={isVerified || isLoading}
              >
                {isLoading ? <Spinner /> : "Verify with WorldID"}
              </Button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Processing Attestation</h2>
              <p className="text-sm text-center">
                We're creating your on-chain attestation. This may take a
                moment, please wait.
              </p>
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
                  Your credit score falls within the "Good" range, indicating
                  strong creditworthiness. Based on this, you may be eligible
                  for loan amounts up to $50,000.
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(
                      `https://sepolia.easscan.org/attestation/view/${attestationUID}`,
                      "_blank"
                    )
                  }
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
