import React from "react";
import PlaidLink from "../bank/PlaidLink";
import { CombinedUserProfile } from "@/lib/types/dynamic";

interface PlaidVerificationProps {
  onVerified: () => void;
  onFailed: () => void;
  user: CombinedUserProfile;
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
