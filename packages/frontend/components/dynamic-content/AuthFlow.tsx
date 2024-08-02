"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ExtendedUserProfile } from "@/lib/types/dynamic";
import UniqueProofId from "../world-id";
import { useLocale } from "next-intl";

enum AuthStep {
  Initial,
  WorldID,
  Plaid,
  Complete,
}

export function AuthFlow() {
  const { user } = useDynamicContext();
  const [authStep, setAuthStep] = useState(AuthStep.Initial);
  const router = useRouter();
  const locale = useLocale();
  const session = true; // replace with your actual session logic
  const verified = true; // replace with your actual verification logic

  useEffect(() => {
    if (user && (user as ExtendedUserProfile).newUser) {
      setAuthStep(AuthStep.WorldID);
    }
  }, [user]);

  const handleWorldIDComplete = () => {
    setAuthStep(AuthStep.Plaid);
  };

  const handlePlaidComplete = () => {
    setAuthStep(AuthStep.Complete);
  };

  const goToDashboard = () => {
    if (session && verified) {
      const path = `/${locale}/dashboard/explore`;
      router.push(path);
    } else {
      console.error("You need to be signed in to access the dashboard.");
    }
  };

  const renderAuthContent = () => {
    switch (authStep) {
      case AuthStep.WorldID:
        return (
          <div className="grid grid-cols-1 gap-4 items-center justify-items-center pt-10 sm:gap-4 sm:p-4">
            <p className="dark:text-white text-lg font-clash uppercase animate-pulse">
              World ID Verification
            </p>
            <p className="text-sm text-gray-600 mb-2 text-center text-violet">
              Please complete your World ID verification.
            </p>
            <UniqueProofId onVerified={handleWorldIDComplete} />
          </div>
        );
      case AuthStep.Plaid:
        return (
          <div className="grid grid-cols-1 gap-4 items-center justify-items-center pt-10 sm:gap-4 sm:p-4">
            <p className="dark:text-white text-lg font-clash uppercase animate-pulse">
              Connect Your Financial Statement Accounts
            </p>
            <p className="text-sm text-gray-600 mb-2 text-center text-violet">
              Please connect your bank account using Plaid.
            </p>
            {/* Add Plaid connection component here */}
            <Button onClick={handlePlaidComplete}>Connect Plaid</Button>
          </div>
        );
      case AuthStep.Complete:
        return (
          <div className="flex flex-col h-full">
            <div className="p-4 bg-basement-tone-purple rounded-md">
              <h2 className="text-lg font-bold text-white">
                Verification Complete
              </h2>
              <p className="text-white">
                Thank you for completing the verification process.
              </p>
            </div>
            <div className="mt-4 p-4 bg-white/5 rounded-md shadow my-4">
              <div className="py-4">
                <h2 className="text-lg text-basement-indigo text-center font-semibold font-clash uppercase animate-pulse">
                  Access Granted
                </h2>
                <p className="mt-4 text-sm text-gray-500">
                  Welcome to{" "}
                  <span className="font-clash uppercase">FORESTA</span>. You are
                  securely signed in with your Polkadot account.
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Now you can go to the dashboard.
                </p>
              </div>
            </div>
            <div className="flex mt-2 justify-center">
              <Button onClick={goToDashboard}>Go to Dashboard</Button>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col h-full">
            <div className="p-4 bg-basement-tone-purple rounded-md">
              <p className="text-white">Verification Failed</p>
            </div>
          </div>
        );
    }
  };

  return user && (user as ExtendedUserProfile).newUser
    ? renderAuthContent()
    : null;
}
