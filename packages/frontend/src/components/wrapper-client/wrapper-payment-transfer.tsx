"use client";

import React from "react";
import { useAppwriteUser } from "@/hooks/use-fetch-user";
import PaymentTransfer from "@/components/dashboard/payment-transfer";
import { CombinedUserProfile } from "@/lib/types/dynamic";
import PaymentTransferSkeleton from "@/components/dashboard/skeleton/payment-transfer-skeleton";

interface WrapperProps {
  searchParams: {
    userId: string;
  };
}

const WrapperPaymentTransfer = ({ searchParams }: WrapperProps) => {
  const { userId } = searchParams;
  const { appwriteUser: user, loading, error } = useAppwriteUser(userId);

  if (loading) {
    return <PaymentTransferSkeleton />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <div>No user found</div>;
  }

  return (
    <PaymentTransfer
      userId={userId}
      user={user as CombinedUserProfile}
      loading={loading}
      error={error}
    />
  );
};

export default WrapperPaymentTransfer;
