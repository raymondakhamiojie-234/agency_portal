import { useState, useEffect } from "react";

export function useDashboardData(user, userLoading) {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [testimonials, setTestimonials] = useState([]);
  const [userTestimonial, setUserTestimonial] = useState(null);

  useEffect(() => {
    if (!userLoading && !user) {
      console.log("❌ No user found, redirecting to signin");
      window.location.href = "/account/signin?callbackUrl=/portal/dashboard";
    }

    if (!userLoading && user) {
      console.log("✅ User authenticated, loading dashboard data");
      fetchDashboardData();
    }
  }, [user, userLoading]);

  const fetchDashboardData = async () => {
    try {
      console.log("📊 Fetching dashboard data...");

      const [profileRes, statsRes, testimonialsRes] = await Promise.all([
        fetch("/api/creator-profile"),
        fetch("/api/dashboard-stats"),
        fetch("/api/testimonials"),
      ]);

      if (!profileRes.ok) {
        throw new Error("Failed to fetch profile");
      }

      const profileData = await profileRes.json();

      if (!profileData.profile) {
        console.log("⚠️ No profile found, redirecting to onboarding");
        window.location.href = "/portal/onboarding";
        return;
      }

      console.log("✅ Profile loaded:", profileData.profile.full_name);
      setProfile(profileData.profile);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        console.log("✅ Stats loaded");
        setStats(statsData.stats);
      }

      if (testimonialsRes.ok) {
        const testimonialsData = await testimonialsRes.json();
        console.log("✅ Testimonials loaded");
        setTestimonials(testimonialsData.testimonials || []);
        setUserTestimonial(testimonialsData.userTestimonial || null);
      }

      setLoading(false);
      console.log("✅ Dashboard loaded successfully");
    } catch (err) {
      console.error("❌ Dashboard error:", err);
      setError("Failed to load dashboard data");
      setLoading(false);
    }
  };

  return {
    profile,
    stats,
    loading,
    error,
    testimonials,
    userTestimonial,
    setUserTestimonial,
    setTestimonials,
    refetchDashboardData: fetchDashboardData,
  };
}
