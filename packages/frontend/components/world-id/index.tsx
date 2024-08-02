"use client";

import React from "react";
import {
  IDKitWidget,
  VerificationLevel,
  ISuccessResult,
} from "@worldcoin/idkit";
import type { VerifyReply } from "../../app/api/world-id/verify";

interface UniqueProofIdProps {
  onVerified: () => void;
}

const UniqueProofId: React.FC<UniqueProofIdProps> = ({ onVerified }) => {
  if (
    !process.env.NEXT_PUBLIC_WLD_APP_ID ||
    !process.env.NEXT_PUBLIC_WLD_ACTION
  ) {
    throw new Error("app_id or action is not set in environment variables!");
  }

  const handleProof = async (result: ISuccessResult) => {
    console.log("Proof received from IDKit:\n", JSON.stringify(result));
    const reqBody = {
      merkle_root: result.merkle_root,
      nullifier_hash: result.nullifier_hash,
      proof: result.proof,
      verification_level: result.verification_level,
      action: process.env.NEXT_PUBLIC_WLD_ACTION,
      signal: "",
    };
    console.log(
      "Sending proof to backend for verification:\n",
      JSON.stringify(reqBody)
    );
    const res: Response = await fetch("/api/world-id/verify", {
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
      throw new Error(
        `Error code ${res.status} (${data.code}): ${data.detail}` ??
          "Unknown error."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center align-middle h-screen">
      <IDKitWidget
        action={process.env.NEXT_PUBLIC_WLD_ACTION!}
        app_id={process.env.NEXT_PUBLIC_WLD_APP_ID as `app_staging_${string}`}
        onSuccess={() => console.log("Modal closed")}
        handleVerify={handleProof}
        verification_level={VerificationLevel.Device}
      >
        {({ open }) => (
          <button className="border border-black rounded-md" onClick={open}>
            <div className="mx-3 my-1">Verify with World ID</div>
          </button>
        )}
      </IDKitWidget>
    </div>
  );
};

export default UniqueProofId;
