"use client";

import React from "react";
import { useAppwriteUser } from "@/hooks/use-fetch-user";
import TransactionHistory from "@/components/dashboard/transaction-history";
import { CombinedUserProfile } from "@/lib/types/dynamic";
import TransactionHistorySkeleton from "@/components/dashboard/skeleton/transaction-history-skeleton";

interface WrapperProps {
  searchParams: {
    userId: string;
    page: string;
    id?: string;
  };
}

const WrapperTransactionHistory = ({ searchParams }: WrapperProps) => {
  const { userId, page, id } = searchParams;
  const { appwriteUser: user, loading, error } = useAppwriteUser(userId);

  if (loading) {
    return <TransactionHistorySkeleton />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <div>No user found</div>;
  }

  return (
    <TransactionHistory
      searchParams={{ userId, page, id }}
      user={user as CombinedUserProfile}
      error={error}
    />
  );
};

export default WrapperTransactionHistory;
