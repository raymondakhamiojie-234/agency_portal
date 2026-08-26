/**
 * USER DATA HOOK
 *
 * This hook provides access to the current user's data.
 * Adapt this to work with your chosen authentication provider.
 *
 * Expected return format:
 * {
 *   data: User | null,
 *   user: User | null,
 *   loading: boolean,
 *   refetch: () => Promise<void>
 * }
 *
 * Integration Examples:
 *
 * 1. NextAuth.js:
 *    import { useSession } from "next-auth/react"
 *    const { data: session, status } = useSession()
 *
 * 2. Clerk:
 *    import { useUser } from "@clerk/nextjs"
 *    const { user, isLoaded } = useUser()
 *
 * 3. Custom API:
 *    Fetch user data from your API endpoint
 */

import * as React from "react";

// TODO: Import your auth provider's session hook
// Example: import { useSession } from "next-auth/react"
// Example: import { useUser as useClerkUser } from "@clerk/nextjs"

const useUser = () => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  /**
   * Fetch current user from your auth provider
   */
  const fetchUser = React.useCallback(async () => {
    try {
      setLoading(true);
      console.log("👤 Fetching user data...");

      const response = await fetch("/api/auth/me", {
        credentials: "include", // Important: include cookies
      });

      if (!response.ok) {
        console.log("❌ No user session found");
        setUser(null);
        return null;
      }

      const userData = await response.json();
      console.log("✅ User loaded:", userData.email);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refetch user data
   */
  const refetchUser = React.useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  // Fetch user on mount
  React.useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    data: user,
    loading,
    refetch: refetchUser,
  };
};

export { useUser };
export default useUser;
