import React from "react";
import VerifyProofId from "../world-id/verify-only";

interface WorldIdVerificationProps {
  onVerified: () => void;
  onFailed: () => void;
  userId: string;
}

export const WorldIdVerification: React.FC<WorldIdVerificationProps> = ({
  onVerified,
  onFailed,
  userId,
}) => {
  return (
    <>
      <VerifyProofId
        userId={userId}
        onStart={() => {}}
        onVerified={onVerified}
        onFailed={onFailed}
      />
    </>
  );
};
