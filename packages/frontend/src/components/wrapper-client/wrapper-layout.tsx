"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import RootLayout from "@/components/dashboard/layout";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const authStoreUserId = useAuthStore((state) => state.userId);

  useEffect(() => {
    if (authStoreUserId) {
      setUserId(authStoreUserId);
    }
  }, [authStoreUserId]);

  if (!userId) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return <RootLayout userId={userId}>{children}</RootLayout>;
};

export default Wrapper;
