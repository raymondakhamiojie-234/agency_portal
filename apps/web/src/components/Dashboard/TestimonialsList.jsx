import { Star } from "lucide-react";

export function TestimonialsList({ testimonials }) {
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="font-plus-jakarta-sans font-semibold text-lg text-[#111111] dark:text-white mb-4">
        What Other Creators Say
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className="p-4 bg-gray-50 dark:bg-[#0A0A0A] rounded-lg border border-gray-200 dark:border-gray-700 animate-fade-in-up"
            style={{ animationDelay: `${1.0 + index * 0.1}s` }}
          >
            {/* Rating Stars */}
            <div className="flex items-center space-x-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className={`${
                    star <= testimonial.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>

            {/* Testimonial Text */}
            <p className="font-inter text-sm text-[#111111] dark:text-white mb-3">
              "{testimonial.testimonial_text}"
            </p>

            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-inter font-medium text-sm text-[#111111] dark:text-white">
                  {testimonial.full_name}
                </p>
                <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
                  {testimonial.page_name} · {testimonial.primary_platform}
                </p>
              </div>
              <p className="font-inter text-xs text-[#525252] dark:text-white dark:text-opacity-70">
                {new Date(testimonial.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
