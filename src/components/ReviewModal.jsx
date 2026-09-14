import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Star, Check } from 'lucide-react';


export const ReviewModal = ({ product, isOpen, onClose }) => {
  const { addReview } = useShop();
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !reviewText.trim()) return;

    addReview(product.id, name.trim(), rating, reviewText.trim());
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setReviewText('');
      setRating(5);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-[#FBF8F2] border border-[#E8DDCD] max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 overflow-hidden">
        {/* Close Button */}
        <button
          id="close-review-modal"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#193826]/60 hover:text-[#193826] p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#193826] text-[#FBF8F2] flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-[#193826]">Review Published</h3>
            <p className="text-xs text-[#193826]/70">
              Thank you for sharing your experience with {product.name}.
            </p>
          </div>
        ) : (
          <div>
            <div className="space-y-1 pb-4 border-b border-[#E8DDCD]">
              <span className="text-[11px] uppercase tracking-widest text-[#C5A869] font-medium">
                Customer Feedback
              </span>
              <h3 className="font-serif text-2xl text-[#193826]">
                Review {product.name}
              </h3>
              <p className="text-xs text-[#193826]/70">
                Share your honest impressions on flavor, texture, and natural snacking.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-5">
              {/* Rating selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-[#193826] mb-1.5">
                  Your Rating
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      id={`star-btn-${star}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          (hoverRating !== null ? star <= hoverRating : star <= rating)
                            ? 'text-[#C5A869] fill-[#C5A869]'
                            : 'text-[#D8CABB]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-[#193826] ml-2">
                    {hoverRating || rating} out of 5 stars
                  </span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="review-name"
                  className="block text-xs uppercase tracking-wider font-medium text-[#193826] mb-1"
                >
                  Your Name
                </label>
                <input
                  id="review-name"
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F5EFEB] border border-[#E8DDCD] px-3.5 py-2.5 text-xs sm:text-sm text-[#193826] placeholder-[#193826]/40 focus:outline-none focus:border-[#193826]"
                />
              </div>

              {/* Review Text */}
              <div>
                <label
                  htmlFor="review-text"
                  className="block text-xs uppercase tracking-wider font-medium text-[#193826] mb-1"
                >
                  Your Review
                </label>
                <textarea
                  id="review-text"
                  required
                  rows={4}
                  placeholder="Tell us what you loved about the taste, crunch, chewiness, or aroma..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full bg-[#F5EFEB] border border-[#E8DDCD] px-3.5 py-2.5 text-xs sm:text-sm text-[#193826] placeholder-[#193826]/40 focus:outline-none focus:border-[#193826]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-[#E8DDCD] text-xs uppercase tracking-wider text-[#193826]/70 hover:text-[#193826]"
                >
                  Cancel
                </button>
                <button
                  id="submit-review-btn"
                  type="submit"
                  className="px-6 py-2.5 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
