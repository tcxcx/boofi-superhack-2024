// src/components/dynamic-content/AuthFlow.tsx

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ExtendedUserProfile } from "@/lib/types/dynamic";

enum AuthStep {
  Initial,
  WorldID,
  Plaid,
  Complete,
}

export function AuthFlow() {
  const { user } = useDynamicContext();
  const [authStep, setAuthStep] = useState(AuthStep.Initial);

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

  const renderAuthContent = () => {
    switch (authStep) {
      case AuthStep.WorldID:
        return (
          <div>
            <h2>World ID Verification</h2>
            <p>Please complete your World ID verification.</p>
            {/* Add World ID verification component here */}
            <Button onClick={handleWorldIDComplete}>Complete World ID</Button>
          </div>
        );
      case AuthStep.Plaid:
        return (
          <div>
            <h2>Connect Your Bank Account</h2>
            <p>Please connect your bank account using Plaid.</p>
            {/* Add Plaid connection component here */}
            <Button onClick={handlePlaidComplete}>Connect Plaid</Button>
          </div>
        );
      case AuthStep.Complete:
        return (
          <div>
            <h2>Verification Complete</h2>
            <p>Thank you for completing the verification process.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return user && (user as ExtendedUserProfile).newUser
    ? renderAuthContent()
    : null;
}
