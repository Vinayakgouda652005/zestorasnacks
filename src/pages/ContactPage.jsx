import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    }, 4000);
  };

  return (
    <div className="bg-[#FBF8F2] min-h-screen py-12 lg:py-20 text-[#193826]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C5A869] font-semibold">
            We'd Love to Hear from You
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#193826]">
            Get in Touch
          </h1>
          <p className="text-sm sm:text-base text-[#193826]/70 leading-relaxed">
            Have a question about our fruits, bulk orders, festive corporate gifting, or your parcel delivery? Reach out anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#F5EFEB] border border-[#E8DDCD] p-8 space-y-6">
              <h3 className="font-serif text-2xl text-[#193826]">
                Customer Care & Operations
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-[#193826]/80">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#C5A869] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#193826] block">Email Us</span>
                    <a href="mailto:zestorasnacks@gmail.com" className="hover:text-[#C5A869] transition-colors">
                      zestorasnacks@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#C5A869] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#193826] block">WhatsApp / Call Support</span>
                    <a
                      href="https://wa.me/919880882476"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#C5A869] transition-colors block"
                    >
                      +91 9880882476
                    </a>
                    <p className="text-[11px] text-[#193826]/60">Mon – Sat: 9:00 AM – 7:00 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C5A869] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#193826] block">Pantry & Packing Facility</span>
                    <p>Zestora Foods Pvt. Ltd.</p>
                    <p>Indiranagar, Bangalore, Karnataka 560038, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery FAQ Snippet */}
            <div className="bg-[#F5EFEB] border border-[#E8DDCD] p-6 space-y-3">
              <h4 className="font-serif text-lg text-[#193826]">Dispatch Timeline</h4>
              <p className="text-xs text-[#193826]/70 leading-relaxed">
                All retail orders are dispatched within 24 hours from our climate-controlled packing center. You will receive an SMS and email notification with a live tracking URL as soon as the package is handed to our courier partner.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E8DDCD] p-8 sm:p-10 shadow-xs">
            {submitted ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#193826] text-[#FBF8F2] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-[#C5A869]" />
                </div>
                <h3 className="font-serif text-2xl text-[#193826]">Message Received</h3>
                <p className="text-xs sm:text-sm text-[#193826]/70 max-w-sm mx-auto">
                  Thank you for reaching out. One of our pantry team members will reply to your email within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-[#E8DDCD] pb-4">
                  <h3 className="font-serif text-2xl text-[#193826]">Send a Message</h3>
                  <p className="text-xs text-[#193826]/60">We reply to every email with care.</p>
                </div>

                <div>
                  <label htmlFor="contact-name" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="e.g. Vikram Joshi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#FBF8F2] border border-[#E8DDCD] px-4 py-3 text-sm text-[#193826] focus:outline-none focus:border-[#193826]"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                    Your Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#FBF8F2] border border-[#E8DDCD] px-4 py-3 text-sm text-[#193826] focus:outline-none focus:border-[#193826]"
                  />
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                    Topic of Inquiry
                  </label>
                  <select
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#FBF8F2] border border-[#E8DDCD] px-4 py-3 text-sm text-[#193826] focus:outline-none focus:border-[#193826]"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order & Tracking">Order & Tracking</option>
                    <option value="Corporate & Wedding Gifting">Corporate & Wedding Gifting</option>
                    <option value="Wholesale / Retail Partnership">Wholesale / Retail Partnership</option>
                    <option value="Feedback on Taste">Feedback on Taste</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                    Your Message *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    placeholder="How can we help you today?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#FBF8F2] border border-[#E8DDCD] px-4 py-3 text-sm text-[#193826] focus:outline-none focus:border-[#193826]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    id="contact-submit-btn"
                    type="submit"
                    className="w-full py-4 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
