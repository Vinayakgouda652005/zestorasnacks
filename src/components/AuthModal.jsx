import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { authService } from '../services/authService';
import { X, Eye, EyeOff, Lock, Mail, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    authModalMessage,
    handleLogin,
    handleSignup,
    showToast
  } = useShop();

  const [mode, setMode] = useState(authModalMode || 'login'); // 'login' | 'signup' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
    }
    setErrorMessage('');
    setSuccessMessage('');
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const onLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = handleLogin(email, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to login');
      }
    }, 400);
  };

  const onSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = handleSignup({
        fullName,
        email,
        phone,
        password
      });
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to create account');
      }
    }, 400);
  };

  const onForgotSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const res = authService.forgotPassword(email);
      if (res.success) {
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.error || 'Unable to process reset request.');
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#FAF7F2] border border-[#E8DDCD] max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 rounded-[2px] overflow-hidden">
        {/* Close Button */}
        <button
          id="close-auth-modal-btn"
          onClick={handleClose}
          className="absolute top-5 right-5 text-[#193826]/60 hover:text-[#193826] p-1 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="space-y-1 pb-4 border-b border-[#E8DDCD]">
          <span className="text-[11px] uppercase tracking-widest text-[#C5A869] font-medium">
            Zestora Membership
          </span>
          <h2 className="font-serif text-2xl text-[#193826]">
            {mode === 'login' && 'Sign In to Your Account'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h2>
          <p className="text-xs text-[#193826]/70">
            {mode === 'login' && 'Track orders, access saved addresses, and express checkout.'}
            {mode === 'signup' && 'Join the clean snacking community for seamless ordering.'}
            {mode === 'forgot' && 'Enter your email address to receive password recovery help.'}
          </p>
        </div>

        {/* Optional Action Banner (e.g. from checkout) */}
        {authModalMessage && (
          <div className="mt-4 p-3 bg-[#F5EFEB] border border-[#E8DDCD] text-xs text-[#193826] flex items-start gap-2 rounded-[2px]">
            <Lock className="w-4 h-4 text-[#C5A869] shrink-0 mt-0.5" />
            <div className="leading-tight">
              <strong className="font-semibold block mb-0.5">Checkout Login Required</strong>
              <span>{authModalMessage} Your cart is safely preserved.</span>
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 rounded-[2px]">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success notification */}
        {successMessage && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2 rounded-[2px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab switcher */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 gap-2 mt-5 p-1 bg-[#EFE8DE] rounded-[2px]">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`py-1.5 text-xs font-semibold rounded-[2px] transition-all ${
                mode === 'login'
                  ? 'bg-[#193826] text-[#FBF8F2] shadow-xs'
                  : 'text-[#193826]/70 hover:text-[#193826]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage('');
              }}
              className={`py-1.5 text-xs font-semibold rounded-[2px] transition-all ${
                mode === 'signup'
                  ? 'bg-[#193826] text-[#FBF8F2] shadow-xs'
                  : 'text-[#193826]/70 hover:text-[#193826]'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* ================= LOGIN FORM ================= */}
        {mode === 'login' && (
          <form onSubmit={onLoginSubmit} className="space-y-4 pt-4">
            <div>
              <label htmlFor="login-email" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="e.g. priya.sharma@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E8DDCD] pl-9 pr-3 py-2.5 text-xs text-[#193826] placeholder-[#193826]/40 focus:outline-none focus:border-[#193826]"
                />
                <Mail className="w-4 h-4 text-[#193826]/40 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="login-password" className="block text-xs uppercase tracking-wider font-semibold text-[#193826]">
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setErrorMessage('');
                  }}
                  className="text-[11px] text-[#193826]/70 hover:text-[#193826] underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E8DDCD] pl-9 pr-9 py-2.5 text-xs text-[#193826] placeholder-[#193826]/40 focus:outline-none focus:border-[#193826]"
                />
                <Lock className="w-4 h-4 text-[#193826]/40 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#193826]/50 hover:text-[#193826]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Credentials Hint */}
            <div className="bg-[#F5EFEB] p-2.5 border border-[#E8DDCD] text-[11px] text-[#193826]/80 flex justify-between items-center">
              <span>Demo Customer: <strong>priya.sharma@example.com</strong></span>
              <button
                type="button"
                onClick={() => {
                  setEmail('priya.sharma@example.com');
                  setPassword('password123');
                }}
                className="text-[#193826] font-semibold underline hover:text-[#C5A869]"
              >
                Auto Fill
              </button>
            </div>

            <button
              id="auth-login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all rounded-[2px] disabled:opacity-60"
            >
              {isLoading ? 'Signing In...' : 'Sign In & Continue'}
            </button>
          </form>
        )}

        {/* ================= SIGNUP FORM ================= */}
        {mode === 'signup' && (
          <form onSubmit={onSignupSubmit} className="space-y-3 pt-4">
            <div>
              <label htmlFor="signup-name" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                Full Name *
              </label>
              <div className="relative">
                <input
                  id="signup-name"
                  type="text"
                  required
                  placeholder="e.g. Radhika Deshmukh"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E8DDCD] pl-9 pr-3 py-2 text-xs text-[#193826] placeholder-[#193826]/40 focus:outline-none focus:border-[#193826]"
                />
                <User className="w-4 h-4 text-[#193826]/40 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  id="signup-email"
                  type="email"
                  required
                  placeholder="e.g. radhika@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E8DDCD] pl-9 pr-3 py-2 text-xs text-[#193826] placeholder-[#193826]/40 focus:outline-none focus:border-[#193826]"
                />
                <Mail className="w-4 h-4 text-[#193826]/40 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label htmlFor="signup-phone" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                Phone Number (10 Digits) *
              </label>
              <div className="relative">
                <input
                  id="signup-phone"
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 9880882476"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#FFFFFF] border border-[#E8DDCD] pl-9 pr-3 py-2 text-xs text-[#193826] placeholder-[#193826]/40 focus:outline-none focus:border-[#193826]"
                />
                <Phone className="w-4 h-4 text-[#193826]/40 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="signup-password" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                  Password *
                </label>
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min 6 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E8DDCD] px-3 py-2 text-xs text-[#193826] placeholder-[#193826]/40 focus:outline-none focus:border-[#193826]"
                />
              </div>

              <div>
                <label htmlFor="signup-confirm-password" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                  Confirm *
                </label>
                <input
                  id="signup-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E8DDCD] px-3 py-2 text-xs text-[#193826] placeholder-[#193826]/40 focus:outline-none focus:border-[#193826]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#193826]/70 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="rounded text-[#193826]"
                />
                <span>Show password</span>
              </label>
            </div>

            <button
              id="auth-signup-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all rounded-[2px] disabled:opacity-60"
            >
              {isLoading ? 'Creating Account...' : 'Register & Continue'}
            </button>
          </form>
        )}

        {/* ================= FORGOT PASSWORD ================= */}
        {mode === 'forgot' && (
          <form onSubmit={onForgotSubmit} className="space-y-4 pt-4">
            <div>
              <label htmlFor="forgot-email" className="block text-xs uppercase tracking-wider font-semibold text-[#193826] mb-1">
                Registered Email Address *
              </label>
              <div className="relative">
                <input
                  id="forgot-email"
                  type="email"
                  required
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E8DDCD] pl-9 pr-3 py-2.5 text-xs text-[#193826] placeholder-[#193826]/40 focus:outline-none focus:border-[#193826]"
                />
                <Mail className="w-4 h-4 text-[#193826]/40 absolute left-3 top-3" />
              </div>
            </div>

            <button
              id="auth-forgot-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#193826] text-[#FBF8F2] text-xs uppercase tracking-widest font-semibold hover:bg-[#12291C] transition-all rounded-[2px] disabled:opacity-60"
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="text-xs text-[#193826] font-semibold underline hover:text-[#C5A869]"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
