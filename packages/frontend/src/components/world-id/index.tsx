"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import {
  IDKitWidget,
  VerificationLevel,
  ISuccessResult,
  IErrorState,
} from "@worldcoin/idkit";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";

// Define VerifyReply type locally
type VerifyReply = {
  code: string;
  detail: string;
};

interface UniqueProofIdProps {
  onStart: () => void;
  onVerified: () => void;
  onFailed: () => void;
}

const UniqueProofId: React.FC<UniqueProofIdProps> = ({
  onStart,
  onVerified,
  onFailed,
}) => {
  const locale = useLocale();
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
    };
    console.log(
      "Sending proof to backend for verification:\n",
      JSON.stringify(reqBody)
    );
    const res: Response = await fetch("/api/worldid/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });
    const data: VerifyReply = await res.json();

    if (res.status === 200) {
      console.log("Successful response from backend:\n", data);
      await signIn("worldcoin", { redirect: false });
      // For OIDC flow, TODO: update the session level in the database or set as state in the session
      const updateSessionRes = await fetch("/api/worldid/update-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (updateSessionRes.ok) {
        const { sessionLevel } = await updateSessionRes.json();
        console.log("Session level updated:", sessionLevel);
        onVerified();
      } else {
        setErrorMessage("Failed to update session level.");
        onFailed();
      }
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
            variant={"outline"}
            size={"xs"}
            onClick={() => {
              onStart();
              open();
            }}
            className="text-blue-900/60"
          >
            Connect World ID
          </Button>
        )}
      </IDKitWidget>
    </div>
  );
};

export default UniqueProofId;
