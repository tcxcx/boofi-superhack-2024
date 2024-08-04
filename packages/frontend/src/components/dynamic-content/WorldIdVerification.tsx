import React from "react";
import UniqueProofId from "../world-id";

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
      <UniqueProofId
        userId={userId}
        onStart={() => {}}
        onVerified={onVerified}
        onFailed={onFailed}
      />
    </>
  );
};
