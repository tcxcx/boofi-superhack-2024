import { useState, useEffect, useCallback } from "react";
import { CombinedUserProfile } from "@/lib/types/dynamic";
import { debounce } from "lodash";

export function useAppwriteUser(userId: string | undefined) {
  const [appwriteUser, setAppwriteUser] = useState<CombinedUserProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Debounced function to fetch the user
  const fetchUser = useCallback(async (userId: string) => {
    if (!userId) {
      setError(new Error("User ID is undefined"));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/user/${userId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${JSON.stringify(
            errorData
          )}`
        );
      }
      const userData = await response.json();
      setAppwriteUser(userData);
    } catch (err) {
      console.error("Error fetching user from fetch hook user:", err);
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced version of fetchUser
  const debouncedFetchUser = useCallback(
    debounce((userId: string) => {
      fetchUser(userId);
    }, 300), // 300ms debounce delay
    [fetchUser]
  );

  useEffect(() => {
    if (userId) {
      debouncedFetchUser(userId);
    }

    // Cleanup the debounce on unmount
    return () => debouncedFetchUser.cancel();
  }, [userId, debouncedFetchUser]);

  return { appwriteUser, loading, error };
}
