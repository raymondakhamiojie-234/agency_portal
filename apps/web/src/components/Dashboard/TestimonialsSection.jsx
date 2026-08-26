import { MessageSquare } from "lucide-react";
import { TestimonialForm } from "./TestimonialForm";
import { TestimonialsList } from "./TestimonialsList";

export function TestimonialsSection({
  testimonials,
  userTestimonial,
  testimonialRating,
  setTestimonialRating,
  testimonialText,
  setTestimonialText,
  testimonialSubmitting,
  testimonialSuccess,
  testimonialError,
  handleTestimonialSubmit,
}) {
  return (
    <div
      className="bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-xl p-6 opacity-0 animate-fade-in-up"
      style={{ animationDelay: "0.9s" }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h2 className="font-plus-jakarta-sans font-bold text-xl text-[#111111] dark:text-white">
          Share Your Experience with Falcus Media Ltd
        </h2>
      </div>

      <TestimonialForm
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

      <TestimonialsList testimonials={testimonials} />
    </div>
  );
}
