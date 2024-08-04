// /home/tcxcx/coding_projects/template-hackathon-2024/src/components/wrapper-client/wrapper-page.tsx

"use client";

import Home from "@/components/dashboard/home";
import { useAppwriteUser } from "@/hooks/use-fetch-user";
import { CombinedUserProfile } from "@/lib/types/dynamic";

interface WrapperProps {
  searchParams: {
    userId: string;
    page: string;
  };
}

const Wrapper = ({ searchParams }: WrapperProps) => {
  const { userId } = searchParams;
  const { appwriteUser: user, loading, error } = useAppwriteUser(userId);

  console.log("User ID:", userId);
  console.log("User:", user);

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
