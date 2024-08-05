import React, { useState, useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import UniqueProofId from "../world-id";
import { X, Check } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { getUserVerificationStatus } from "@/lib/actions/worldId.actions";
import PlaidLink from "@/components/bank/PlaidLink";
import { CombinedUserProfile } from "@/lib/types/dynamic";

enum AuthStep {
  Initial,
  WorldID,
  Plaid,
  Complete,
}

interface AuthFlowProps {
  needsVerification: boolean;
  onWorldIdStart: () => void;
  onWorldIdClose: (success: boolean) => void;
  onPlaidStart: () => void;
  onPlaidClose: (success: boolean) => void;
  sessionLevel?: number;
  isWorldIdVerifying: boolean;
  isPlaidVerifying: boolean;
}

export function AuthFlow({
  needsVerification,
  isWorldIdVerifying,
  isPlaidVerifying,
  onPlaidStart,
  onPlaidClose,
  onWorldIdStart,
  onWorldIdClose,
  sessionLevel,
}: AuthFlowProps) {
  const { user } = useDynamicContext();
  const [authStep, setAuthStep] = useState(AuthStep.Initial);
  const [isWorldIdVerified, setIsWorldIdVerified] = useState(false);
  const [isPlaidVerified, setIsPlaidVerified] = useState(false);
  const { setWorldIdVerifying, setPlaidVerifying, setVerified } =
    useAuthStore();

  useEffect(() => {
    async function fetchVerificationStatus() {
      if (user?.userId) {
        try {
          const userData = await getUserVerificationStatus(user.userId);
          setIsWorldIdVerified(userData?.worldIdVerified || false);
          setIsPlaidVerified(userData?.connectedPlaidAccounts || false);
          if (userData?.worldIdVerified && userData?.connectedPlaidAccounts) {
            setVerified(true);
          }
        } catch (error) {
          console.error("Error fetching user verification status:", error);
          setIsWorldIdVerified(false);
          setIsPlaidVerified(false);
        }
      }
    }

    fetchVerificationStatus();

    if (user && needsVerification) {
      setAuthStep(AuthStep.WorldID);
    }
  }, [user, needsVerification, setVerified]);

  const handleWorldIDComplete = (success: boolean) => {
    if (success) {
      setAuthStep(AuthStep.Plaid);
    } else {
      setAuthStep(AuthStep.WorldID);
    }
    onWorldIdClose(success);
  };

  const handlePlaidComplete = (success: boolean) => {
    onPlaidClose(success);
    if (success) {
      setAuthStep(AuthStep.Complete);
      setVerified(true);
    } else {
      setAuthStep(AuthStep.Plaid);
    }
  };

  const renderVerificationStatus = (
    isVerified: boolean,
    label: string,
    action: React.ReactNode
  ) => (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-2">
        {isVerified ? (
          <Check className="text-green-500" size={16} />
        ) : (
          <X className="text-red-500" size={16} />
        )}
        <span className="text-xs text-blue-900/60">
          {label} {isVerified ? "verified" : "not verified"}
        </span>
      </div>
      {!isVerified && action}
    </div>
  );

  const renderAuthContent = () => {
    return (
      <div className="space-y-2 mx-6 text-xs">
        {renderVerificationStatus(
          isWorldIdVerified,
          "World ID",
          !isWorldIdVerified && (
            <UniqueProofId
              userId={user?.userId ?? null}
              onStart={onWorldIdStart}
              onVerified={() => handleWorldIDComplete(true)}
              onFailed={() => handleWorldIDComplete(false)}
            />
          )
        )}
        <div className="z-100">
          {renderVerificationStatus(
            isPlaidVerified,
            "Plaid",
            !isPlaidVerified && (
              <PlaidLink
                user={user as CombinedUserProfile}
                variant="outline"
                onStart={onPlaidStart}
                onVerified={() => handlePlaidComplete(true)}
                onFailed={() => handlePlaidComplete(false)}
              />
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      {renderAuthContent()}
    </div>
  );
}
