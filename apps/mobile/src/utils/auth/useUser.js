/**
 * MOBILE USER DATA HOOK
 *
 * This hook provides access to the current user's data in mobile apps.
 * Adapt this to work with your chosen authentication provider.
 *
 * Integration Examples:
 *
 * 1. Clerk:
 *    import { useUser } from "@clerk/clerk-expo"
 *
 * 2. Supabase:
 *    const { data: { user } } = await supabase.auth.getUser()
 *
 * 3. Custom API:
 *    Fetch from your backend using stored auth token
 */

import { useCallback } from "react";
import { useAuth } from "./useAuth";
import * as SecureStore from "expo-secure-store";
import { authKey } from "./store";

export const useUser = () => {
  const { auth, isReady } = useAuth();
  const user = auth?.user || null;

  /**
   * Fetch/refresh user data
   */
  const fetchUser = useCallback(async () => {
    // PLACEHOLDER: Implement user fetching

    // Example with stored auth:
    const storedAuth = await SecureStore.getItemAsync(authKey);
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      return authData?.user || null;
    }

    // Example with API call:
    // const token = await SecureStore.getItemAsync(authKey);
    // if (!token) return null;
    //
    // const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/me`, {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    //
    // if (!response.ok) return null;
    // return await response.json();

    return user;
  }, [user]);

  return {
    user,
    data: user,
    loading: !isReady,
    refetch: fetchUser,
  };
};

export default useUser;
