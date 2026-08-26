import { useState } from "react";

export function useTestimonialSubmit(refetchDashboardData) {
  const [testimonialRating, setTestimonialRating] = useState(5);
  const [testimonialText, setTestimonialText] = useState("");
  const [testimonialSubmitting, setTestimonialSubmitting] = useState(false);
  const [testimonialSuccess, setTestimonialSuccess] = useState("");
  const [testimonialError, setTestimonialError] = useState("");

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    setTestimonialSubmitting(true);
    setTestimonialError("");
    setTestimonialSuccess("");

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: testimonialRating,
          testimonialText: testimonialText.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit testimonial");
      }

      const data = await response.json();
      setTestimonialSuccess(data.message);
      setTestimonialSubmitting(false);

      // Refresh testimonials
      setTimeout(() => {
        refetchDashboardData();
      }, 1000);
    } catch (err) {
      console.error(err);
      setTestimonialError(err.message || "Failed to submit testimonial");
      setTestimonialSubmitting(false);
    }
  };

  const initializeTestimonial = (userTestimonial) => {
    if (userTestimonial) {
      setTestimonialRating(userTestimonial.rating);
      setTestimonialText(userTestimonial.testimonial_text);
    }
  };

  return {
    testimonialRating,
    setTestimonialRating,
    testimonialText,
    setTestimonialText,
    testimonialSubmitting,
    testimonialSuccess,
    testimonialError,
    handleTestimonialSubmit,
    initializeTestimonial,
  };
}
