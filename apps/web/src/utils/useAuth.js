/**
 * WEB AUTH HOOK
 *
 * This hook provides a consistent interface for authentication across your app.
 * Adapt this to work with your chosen authentication provider.
 *
 * Required methods:
 * - signInWithCredentials({ email, password, callbackUrl?, redirect? })
 * - signUpWithCredentials({ email, password, name?, callbackUrl?, redirect? })
 * - signInWithGoogle(options?)
 * - signOut({ callbackUrl?, redirect? })
 *
 * Integration Examples:
 *
 * 1. NextAuth.js:
 *    import { signIn, signOut } from "next-auth/react"
 *
 * 2. Clerk:
 *    import { useSignIn, useSignUp } from "@clerk/nextjs"
 *
 * 3. Custom API:
 *    Make fetch calls to your auth API endpoints
 */

import { useCallback } from "react";

function useAuth() {
  // Get callback URL from query params
  const callbackUrl =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("callbackUrl")
      : null;

  /**
   * Sign in with email and password
   */
  const signInWithCredentials = useCallback(
    async (options) => {
      try {
        console.log("🔐 Sign in attempt for:", options.email);

        const response = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: options.email,
            password: options.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.log("❌ Sign in failed:", data.error);
          throw new Error(data.error || "CredentialsSignin");
        }

        console.log("✅ Sign in successful, user:", data.user);

        // Successful login - redirect
        if (options.redirect !== false) {
          // Always prefer the provided callbackUrl over URL params
          const redirectUrl = options.callbackUrl ?? callbackUrl ?? "/";
          console.log("🔄 Redirecting to:", redirectUrl);

          // Use replace instead of href to avoid back button issues
          window.location.replace(redirectUrl);
        }

        return data;
      } catch (error) {
        console.error("Sign in error:", error);
        throw error;
      }
    },
    [callbackUrl],
  );

  /**
   * Sign up with email and password
   */
  const signUpWithCredentials = useCallback(
    async (options) => {
      try {
        console.log("📝 Sign up attempt for:", options.email);

        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: options.email,
            password: options.password,
            name: options.name,
            // Pass through all extra fields (creator profile data)
            fullName: options.fullName,
            brandName: options.brandName,
            pageName: options.pageName,
            phoneNumber: options.phoneNumber,
            primaryPlatform: options.primaryPlatform,
            pageUrls: options.pageUrls,
            country: options.country,
            referralCode: options.referralCode,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.log("❌ Sign up failed:", data.error);
          // Throw the actual error message from the API
          throw new Error(data.error || "Failed to create account");
        }

        console.log("✅ Sign up successful, user:", data.user);

        // Successful signup - redirect
        if (options.redirect !== false) {
          const redirectUrl =
            callbackUrl ?? options.callbackUrl ?? "/portal/onboarding";
          console.log("🔄 Redirecting to:", redirectUrl);
          window.location.href = redirectUrl;
        }

        return data;
      } catch (error) {
        console.error("Sign up error:", error);
        throw error;
      }
    },
    [callbackUrl],
  );

  /**
   * Sign in with Google OAuth
   */
  const signInWithGoogle = useCallback(
    async (options) => {
      console.warn("Google sign-in not configured");
    },
    [callbackUrl],
  );

  /**
   * Sign in with Facebook OAuth
   */
  const signInWithFacebook = useCallback((options) => {
    console.warn("Facebook sign-in not configured");
  }, []);

  /**
   * Sign in with Twitter OAuth
   */
  const signInWithTwitter = useCallback((options) => {
    console.warn("Twitter sign-in not configured");
  }, []);

  /**
   * Sign out the current user
   *
   * @param {Object} options
   * @param {string} options.callbackUrl - URL to redirect after signout
   * @param {boolean} options.redirect - Whether to redirect after signout
   */
  const signOut = useCallback(async (options) => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });

      if (options?.redirect !== false) {
        window.location.href = options?.callbackUrl ?? "/";
      }
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }, []);

  return {
    signInWithCredentials,
    signUpWithCredentials,
    signInWithGoogle,
    signInWithFacebook,
    signInWithTwitter,
    signOut,
  };
}

export default useAuth;
