import { Star, Send } from "lucide-react";

export function TestimonialForm({
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
    <div className="mb-8 p-6 bg-gray-50 dark:bg-[#0A0A0A] rounded-xl">
      <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#111111] dark:text-white mb-4">
        {userTestimonial ? "Your Testimonial" : "Write a Testimonial"}
      </h3>

      {userTestimonial && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="font-inter text-sm text-blue-800 dark:text-blue-300">
            {userTestimonial.is_approved ? (
              <>
                <strong>Status:</strong> Your testimonial has been approved and
                is now visible to others!
              </>
            ) : (
              <>
                <strong>Status:</strong> Your testimonial is pending review. You
                can update it below if needed.
              </>
            )}
          </p>
        </div>
      )}

      {testimonialSuccess && (
        <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="font-inter text-sm text-green-800 dark:text-green-300">
            {testimonialSuccess}
          </p>
        </div>
      )}

      {testimonialError && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="font-inter text-sm text-red-800 dark:text-red-300">
            {testimonialError}
          </p>
        </div>
      )}

      <form onSubmit={handleTestimonialSubmit}>
        {/* Star Rating */}
        <div className="mb-4">
          <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
            Your Rating
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setTestimonialRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={`${
                    star <= testimonialRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  } transition-colors duration-200`}
                />
              </button>
            ))}
            <span className="ml-4 font-inter text-sm text-[#525252] dark:text-white dark:text-opacity-70">
              {testimonialRating} out of 5 stars
            </span>
          </div>
        </div>

        {/* Testimonial Text */}
        <div className="mb-4">
          <label className="block font-inter text-sm font-medium text-[#111111] dark:text-white mb-2">
            Your Testimonial
          </label>
          <textarea
            value={testimonialText}
            onChange={(e) => setTestimonialText(e.target.value)}
            required
            rows={5}
            minLength={10}
            maxLength={1000}
            className="w-full px-4 py-3 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-lg font-inter text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#726BFF] dark:focus:ring-[#6366FF] transition-all duration-200"
            placeholder="Share your experience working with Falcus Media Ltd..."
          />
          <p className="mt-1 font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
            {testimonialText.length} / 1000 characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={testimonialSubmitting || testimonialText.trim().length < 10}
          className="inline-flex items-center space-x-2 bg-[#726BFF] dark:bg-[#6366FF] text-white font-plus-jakarta-sans font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#6259E6] dark:hover:bg-[#5856FF] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={16} />
          <span>
            {testimonialSubmitting
              ? "Submitting..."
              : userTestimonial
                ? "Update Testimonial"
                : "Submit Testimonial"}
          </span>
        </button>
      </form>
    </div>
  );
}
