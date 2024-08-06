"use client";

import React, { useState } from "react";
import {
  IDKitWidget,
  VerificationLevel,
  ISuccessResult,
  IErrorState,
} from "@worldcoin/idkit";
import { Button } from "@/components/ui/button";

// Define VerifyReply type locally
type VerifyReply = {
  code: string;
  detail: string;
  verification_level?: string;
  attestation?: any;
};

interface UniqueProofIdProps {
  userId: string | null;
  onStart: () => void;
  onVerified: () => void;
  onFailed: () => void;
}

const VerifyProofId: React.FC<UniqueProofIdProps> = ({
  userId,
  onStart,
  onVerified,
  onFailed,
}) => {
  const [errorMessage, setErrorMessage] = useState("");

  const appId = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
  const action = process.env.NEXT_PUBLIC_WLD_ACTION;

  if (!appId || !action) {
    throw new Error("app_id or action is not set in environment variables!");
  }

  const handleProof = async (result: ISuccessResult, error?: IErrorState) => {
    if (error) {
      setErrorMessage(error.message || "Unknown error occurred");
      onFailed();
      return;
    }

    console.log("Proof received from IDKit:\n", JSON.stringify(result));
    const reqBody = {
      merkle_root: result.merkle_root,
      nullifier_hash: result.nullifier_hash,
      proof: result.proof,
      verification_level: result.verification_level,
      action,
      signal: "",
      userId,
    };

    console.log(
      "Sending proof to backend for verification and attestation:\n",
      JSON.stringify(reqBody)
    );

    const res: Response = await fetch("/api/worldid/sybil-attestation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });

    const data: VerifyReply = await res.json();

    if (res.status === 200) {
      console.log("Successful response from backend:\n", data);
      onVerified();
    } else {
      setErrorMessage(data.detail || "Verification failed.");
      onFailed();
      console.error(`Error code ${res.status} (${data.code}): ${data.detail}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center align-middle">
      {errorMessage && <div className="mb-4 text-red-600">{errorMessage}</div>}
      <IDKitWidget
        app_id={appId}
        action={action}
        onSuccess={() => console.log("Modal closed")}
        handleVerify={handleProof}
        verification_level={VerificationLevel.Device}
      >
        {({ open }: { open: () => void }) => (
          <Button
            variant={"fito"}
            onClick={() => {
              onStart();
              open();
            }}
          >
            Connect World ID
          </Button>
        )}
      </IDKitWidget>
    </div>
  );
};

export default VerifyProofId;
