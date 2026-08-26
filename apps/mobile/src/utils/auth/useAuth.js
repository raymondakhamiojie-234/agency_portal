/**
 * MOBILE AUTH HOOK
 *
 * This hook provides authentication functionality for React Native/Expo apps.
 * Adapt this to work with your chosen authentication provider.
 *
 * Required functionality:
 * - isReady: boolean - Whether auth state is initialized
 * - isAuthenticated: boolean - Whether user is signed in
 * - signIn() - Show sign-in UI
 * - signUp() - Show sign-up UI
 * - signOut() - Sign out the current user
 * - auth: Session data
 *
 * Integration Examples:
 *
 * 1. Clerk (Recommended for Expo):
 *    import { useAuth } from "@clerk/clerk-expo"
 *
 * 2. Supabase:
 *    import { useAuth } from '@supabase/auth-helpers-react'
 *
 * 3. Custom API with SecureStore:
 *    Store JWT tokens in SecureStore and validate with your API
 */

import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect } from "react";
import { useAuthModal, useAuthStore, authKey } from "./store";

// TODO: Import your auth provider
// Example: import { useAuth as useClerkAuth } from "@clerk/clerk-expo"

/**
 * This hook provides authentication functionality.
 * It may be easier to use the `useAuthModal` or `useRequireAuth` hooks
 * instead as those will also handle showing authentication to the user
 * directly.
 */
export const useAuth = () => {
  const { isReady, auth, setAuth } = useAuthStore();
  const { isOpen, close, open } = useAuthModal();

  /**
   * Initialize auth state from secure storage
   */
  const initiate = useCallback(() => {
    // PLACEHOLDER: Load auth state from your provider

    // Example with custom implementation:
    SecureStore.getItemAsync(authKey).then((auth) => {
      useAuthStore.setState({
        auth: auth ? JSON.parse(auth) : null,
        isReady: true,
      });
    });

    // Example with Clerk:
    // Clerk handles this automatically
    // Just call useClerkAuth() and it provides isLoaded, isSignedIn, etc.
  }, []);

  useEffect(() => {
    // Initialize on mount if needed
  }, []);

  /**
   * Show sign-in UI
   */
  const signIn = useCallback(() => {
    // PLACEHOLDER: Show sign-in flow

    // Example with custom modal:
    open({ mode: "signin" });

    // Example with Clerk:
    // Clerk provides UI components that you can show
    // Or redirect to Clerk's hosted pages
  }, [open]);

  /**
   * Show sign-up UI
   */
  const signUp = useCallback(() => {
    // PLACEHOLDER: Show sign-up flow

    // Example with custom modal:
    open({ mode: "signup" });
  }, [open]);

  /**
   * Sign out the current user
   */
  const signOut = useCallback(async () => {
    // PLACEHOLDER: Implement sign-out

    // Example with custom implementation:
    setAuth(null);
    await SecureStore.deleteItemAsync(authKey);
    close();

    // Example with Clerk:
    // await clerkSignOut();

    // Example with custom API:
    // await fetch('/api/auth/signout', { method: 'POST' });
    // await SecureStore.deleteItemAsync(authKey);
  }, [close, setAuth]);

  return {
    isReady,
    isAuthenticated: isReady ? !!auth : null,
    signIn,
    signOut,
    signUp,
    auth,
    setAuth,
    initiate,
  };
};

/**
 * This hook will automatically open the authentication modal if the user is not authenticated.
 */
export const useRequireAuth = (options) => {
  const { isAuthenticated, isReady } = useAuth();
  const { open } = useAuthModal();

  useEffect(() => {
    if (!isAuthenticated && isReady) {
      open({ mode: options?.mode });
    }
  }, [isAuthenticated, open, options?.mode, isReady]);
};

export default useAuth;
