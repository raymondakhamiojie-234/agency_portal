import { useState, useEffect } from "react";

export function useProfile(user, userLoading) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = "/account/signin";
    }

    if (!userLoading && user) {
      fetchProfile();
    }
  }, [user, userLoading]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/creator-profile");
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();

      if (!data.profile) {
        window.location.href = "/portal/onboarding";
        return;
      }

      setProfile(data.profile);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load profile");
      setLoading(false);
    }
  };

  return { profile, loading, error, setProfile, setError };
}
