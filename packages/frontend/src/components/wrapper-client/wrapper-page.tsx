"use client";

import Home from "@/components/dashboard/home";
import { useAppwriteUser } from "@/hooks/use-fetch-user";
import { CombinedUserProfile } from "@/lib/types/dynamic";
import HomeSkeleton from "@/components/dashboard/skeleton/home-skeleton";

interface WrapperProps {
  searchParams: {
    userId: string;
    page: string;
  };
}

const Wrapper = ({ searchParams }: WrapperProps) => {
  const { userId } = searchParams;
  const { appwriteUser: user, loading, error } = useAppwriteUser(userId);

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <Home
      userId={userId}
      searchParams={searchParams}
      user={user as CombinedUserProfile}
      loading={loading}
      error={error}
    />
  );
};

export default Wrapper;
