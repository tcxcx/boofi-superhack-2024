"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import UniqueProofId from "../world-id";
import { X, Check } from "lucide-react";
import { signIn } from "next-auth/react";

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
  sessionLevel?: number;
}

export function AuthFlow({
  needsVerification,
  onWorldIdStart,
  onWorldIdClose,
  sessionLevel,
}: AuthFlowProps) {
  const { user } = useDynamicContext();
  const [authStep, setAuthStep] = useState(AuthStep.Initial);
  const router = useRouter();
  const locale = useLocale();

  const needsWorldIdVerified = sessionLevel === 1;
  const isWorldIdVerifiedSession = sessionLevel === 2;
  const isPlaidConnected = (user as any)?.plaidConnected || false;

  useEffect(() => {
    if (user && needsVerification) {
      setAuthStep(AuthStep.WorldID);
    }
  }, [user, needsVerification]);

  const handleWorldIDComplete = (success: boolean) => {
    if (success) {
      setAuthStep(AuthStep.Plaid);
    } else {
      setAuthStep(AuthStep.WorldID);
    }
    onWorldIdClose(success);
  };

  const handlePlaidComplete = () => {
    setAuthStep(AuthStep.Complete);
  };

  const handleWorldIdSignIn = async () => {
    await signIn("worldcoin", { redirect: false });
    onWorldIdClose(true);
  };

  const goToDashboard = () => {
    const path = `/${locale}/dashboard`;
    router.push(path);
  };

  const renderVerificationStatus = (
    isVerified: boolean,
    label: string,
    action: React.ReactNode
  ) => (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-2">
        {isVerified ? (
          <Check className="text-blue-900/20" size={16} />
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
          isWorldIdVerifiedSession,
          "World ID",
          needsWorldIdVerified ? (
            <Button
              onClick={handleWorldIdSignIn}
              variant={"outline"}
              size={"xs"}
              className="text-blue-900/60"
            >
              Sign In with World ID
            </Button>
          ) : (
            <UniqueProofId
              onStart={onWorldIdStart}
              onVerified={() => handleWorldIDComplete(true)}
              onFailed={() => handleWorldIDComplete(false)}
            />
          )
        )}
        {renderVerificationStatus(
          isPlaidConnected,
          "Plaid",
          <div>
            <Button
              onClick={handlePlaidComplete}
              variant={"outline"}
              size={"xs"}
              className="text-blue-900/60"
            >
              Connect Plaid
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      {renderAuthContent()}
    </div>
  );
}
