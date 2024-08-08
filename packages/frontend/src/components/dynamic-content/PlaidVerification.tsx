import React from "react";
import PlaidLink, { RequiredEnsUser } from "../bank/PlaidLink";

interface PlaidVerificationProps {
  onVerified: () => void;
  onFailed: () => void;
  user: RequiredEnsUser;
}

export const PlaidVerification: React.FC<PlaidVerificationProps> = ({
  onVerified,
  onFailed,
  user,
}) => {
  return (
    <>
      <PlaidLink
        variant="outline"
        user={user}
        onStart={() => {}}
        onVerified={onVerified}
        onFailed={onFailed}
      />
    </>
  );
};
