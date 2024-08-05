"use client";

import React from "react";
import { useAppwriteUser } from "@/hooks/use-fetch-user";
import MyBanks from "@/components/dashboard/my-banks";
import { CombinedUserProfile } from "@/lib/types/dynamic";
import MyBanksSkeleton from "@/components/dashboard/skeleton/my-banks-skeleton";

interface WrapperProps {
  searchParams: {
    userId: string;
  };
}

const WrapperMyBanks = ({ searchParams }: WrapperProps) => {
  const { userId } = searchParams;
  const { appwriteUser: user, loading, error } = useAppwriteUser(userId);

  if (loading) {
    return <MyBanksSkeleton />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <div>No user found</div>;
  }

  return (
    <MyBanks
      userId={userId}
      user={user as CombinedUserProfile}
      loading={loading}
      error={error}
    />
  );
};

export default WrapperMyBanks;
