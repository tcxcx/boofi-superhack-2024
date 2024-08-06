import { useState, useEffect } from "react";
import { CombinedUserProfile } from "@/lib/types/dynamic";

export function useAppwriteUser(userId: string | undefined) {
  const [appwriteUser, setAppwriteUser] = useState<CombinedUserProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUser() {
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
        console.error("Error fetching user:", err);
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  return { appwriteUser, loading, error };
}
