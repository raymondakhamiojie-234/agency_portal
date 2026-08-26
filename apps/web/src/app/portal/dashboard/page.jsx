"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import PortalNav from "@/components/PortalNav";
import OnboardingAlert from "@/components/OnboardingAlert";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useTestimonialSubmit } from "@/hooks/useTestimonialSubmit";
import { WelcomeHeader } from "@/components/Dashboard/WelcomeHeader";
import { AccountStatusBanner } from "@/components/Dashboard/AccountStatusBanner";
import { StatsGrid } from "@/components/Dashboard/StatsGrid";
import { RecentEarnings } from "@/components/Dashboard/RecentEarnings";
import { QuickActions } from "@/components/Dashboard/QuickActions";
import { TestimonialsSection } from "@/components/Dashboard/TestimonialsSection";
import { LoadingState } from "@/components/Dashboard/LoadingState";
import { ErrorState } from "@/components/Dashboard/ErrorState";
import { DashboardAnimations } from "@/components/Dashboard/DashboardAnimations";

export default function DashboardPage() {
  const { data: user, loading: userLoading } = useUser();
  const [mounted, setMounted] = useState(false);

  const {
    profile,
    stats,
    loading,
    error,
    testimonials,
    userTestimonial,
    refetchDashboardData,
  } = useDashboardData(user, userLoading);

  const {
    testimonialRating,
    setTestimonialRating,
    testimonialText,
    setTestimonialText,
    testimonialSubmitting,
    testimonialSuccess,
    testimonialError,
    handleTestimonialSubmit,
    initializeTestimonial,
  } = useTestimonialSubmit(refetchDashboardData);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (userTestimonial) {
      initializeTestimonial(userTestimonial);
    }
  }, [userTestimonial]);

  if (userLoading || loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const accountStatus = profile?.account_status || "Under Review";

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      <PortalNav activePage="/portal/dashboard" />

      <main
        className={`max-w-[1240px] mx-auto px-6 py-8 transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        <WelcomeHeader profile={profile} userName={user?.name} />

        <AccountStatusBanner accountStatus={accountStatus} />

        <div style={{ animationDelay: "0.25s" }}>
          <OnboardingAlert />
        </div>

        <StatsGrid stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <RecentEarnings stats={stats} />
          <QuickActions stats={stats} />
        </div>

        <TestimonialsSection
          testimonials={testimonials}
          userTestimonial={userTestimonial}
          testimonialRating={testimonialRating}
          setTestimonialRating={setTestimonialRating}
          testimonialText={testimonialText}
          setTestimonialText={setTestimonialText}
          testimonialSubmitting={testimonialSubmitting}
          testimonialSuccess={testimonialSuccess}
          testimonialError={testimonialError}
          handleTestimonialSubmit={handleTestimonialSubmit}
        />

        <DashboardAnimations />
      </main>
    </div>
  );
}
