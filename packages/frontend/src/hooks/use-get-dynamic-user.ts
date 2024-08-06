"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

const useGetDynamicUser = () => {
  const { userId, setUserId } = useAuthStore();

  useEffect(() => {
    console.log("Current User ID in Zustand store:", userId);
  }, [userId]);

  const setUserIdFromData = (data: any) => {
    const userId = data.id || data.userId || null;
    setUserId(userId);
  };

  return { userId, setUserIdFromData };
};

export default useGetDynamicUser;
