import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { reviewService } from '../services/reviewService';
import { X, Star, Check, Image, AlertCircle, ShieldCheck } from 'lucide-react';

export const ReviewModal = ({ product, orderId, isOpen, onClose }) => {
  const { addReview, user, requireAuth } = useShop();
  const [name, setName] = useState(user?.fullName || '');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user?.fullName) {
      setName(user.fullName);
    }
  }, [user]);

  if (!isOpen || !product) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('Image size should be less than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const isEligible = Boolean(user && reviewService.isEligibleToReview(user.id, user.email, product.id, orderId));
  const alreadyReviewed = Boolean(user && reviewService.hasUserReviewedOrderProduct(user.id, user.email, product.id, orderId));

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user) {
      requireAuth(() => {}, 'Please sign in to submit your product review.');
      return;
    }

    if (!isEligible) {
      setErrorMessage('A review can only be submitted after you have received your delivered order containing this product.');
      return;
    }

    if (alreadyReviewed) {
      setErrorMessage('You have already submitted a review for this product purchase.');
      return;
    }

    if (!name.trim() || !reviewText.trim()) {
      setErrorMessage('Please fill in your name and review impressions.');
      return;
    }

    const res = addReview(product.id, name.trim(), rating, reviewText.trim(), imagePreview, orderId);
    if (res.success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setReviewText('');
        setImagePreview(null);
        setRating(5);
        onClose();
      }, 1200);
    } else {
      setErrorMessage(res.error || 'Unable to submit review.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-[#FAF7F2] border border-[#E8DDCD] max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 rounded-[2px] overflow-hidden">
        {/* Close Button */}
        <button
          id="close-review-modal"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#193826]/60 hover:text-[#193826] p-1 transition-colors"
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
              Thank you for sharing your authentic experience with {product.name}.
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
                Share your honest impressions on flavor, texture, and natural sweetness.
              </p>
            </div>

            {/* Verified buyer status feedback */}
            {user && isEligible && !alreadyReviewed && (
              <div className="mt-4 p-2.5 bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2 rounded-[2px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Purchase {orderId ? `(Order #${orderId})` : ''}: Your order has been delivered and your review will carry the official Verified Buyer badge.</span>
              </div>
            )}

            {user && alreadyReviewed && (
              <div className="mt-4 p-2.5 bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2 rounded-[2px]">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>You have already submitted a review for this purchase. Thank you for your feedback!</span>
              </div>
            )}

            {user && !isEligible && (
              <div className="mt-4 p-2.5 bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2 rounded-[2px]">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Verification Policy: Reviews can only be submitted after your order containing this product has reached <strong>Delivered</strong> status.</span>
              </div>
            )}

            {!user && (
              <div className="mt-4 p-2.5 bg-[#F5EFEB] border border-[#E8DDCD] text-[11px] text-[#193826]/80 flex items-center justify-between gap-2 rounded-[2px]">
                <span>Sign in required to submit reviews and verify authenticity.</span>
                <button
                  type="button"
                  onClick={() => requireAuth(() => {}, 'Sign in to review products.')}
                  className="text-[#193826] font-bold underline hover:text-[#C5A869]"
                >
                  Sign In
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="mt-4 p-2.5 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 rounded-[2px]">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* Rating selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1.5">
                  Your Rating *
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
                  <span className="text-xs text-[#193826]/60 pl-2">
                    {rating === 5 && 'Pure Perfection (5/5)'}
                    {rating === 4 && 'Delicious & Fresh (4/5)'}
                    {rating === 3 && 'Average (3/5)'}
                    {rating === 2 && 'Needs Improvement (2/5)'}
                    {rating === 1 && 'Disappointing (1/5)'}
                  </span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika S."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E8DDCD] px-3.5 py-2.5 text-xs text-[#193826] focus:outline-none focus:border-[#193826] rounded-[2px]"
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                  Your Review *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the texture, fragrance, natural sweetness, and your experience with this fruit snack..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E8DDCD] px-3.5 py-2.5 text-xs text-[#193826] focus:outline-none focus:border-[#193826] resize-none rounded-[2px]"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                  Upload Photo (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-3 py-2 bg-[#FFFFFF] border border-[#E8DDCD] hover:border-[#193826] text-xs text-[#193826] flex items-center gap-1.5 rounded-[2px] transition-colors">
                    <Image className="w-3.5 h-3.5 text-[#C5A869]" />
                    <span>Choose Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <div className="relative w-10 h-10 border border-[#E8DDCD] rounded-[2px] overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute inset-0 bg-black/40 text-white flex items-center justify-center text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[#E8DDCD]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[#E8DDCD] text-xs uppercase tracking-wider font-medium text-[#193826] rounded-[2px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!user || !isEligible || alreadyReviewed}
                  className={`px-6 py-2.5 text-xs uppercase tracking-widest font-semibold transition-all rounded-[2px] ${
                    !user || !isEligible || alreadyReviewed
                      ? 'bg-[#193826]/40 text-[#FBF8F2]/60 cursor-not-allowed'
                      : 'bg-[#193826] text-[#FBF8F2] hover:bg-[#12291C] cursor-pointer'
                  }`}
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
