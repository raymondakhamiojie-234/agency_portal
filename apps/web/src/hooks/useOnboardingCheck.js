import { useState, useEffect } from "react";

export function useOnboardingCheck() {
  const [onboardingStatus, setOnboardingStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch("/api/onboarding-status");
      if (response.ok) {
        const data = await response.json();
        setOnboardingStatus(data);
      }
    } catch (error) {
      console.error("Failed to check onboarding status:", error);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    setLoading(true);
    checkOnboardingStatus();
  };

  return {
    onboardingStatus,
    loading,
    isComplete: onboardingStatus?.isComplete || false,
    canAccessEarnings: onboardingStatus?.canAccessEarnings || false,
    profileComplete: onboardingStatus?.profileComplete || false,
    contractSigned: onboardingStatus?.contractSigned || false,
    missingFields: onboardingStatus?.missingFields || [],
    completionPercentage: onboardingStatus?.completionPercentage || 0,
    refresh,
  };
}
