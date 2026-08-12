'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { 
  X, 
  ChevronLeft, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Check, 
  HelpCircle,
  ShieldCheck 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

const STYLE_PRESETS = [
  'Streetwear',
  'Vintage / Thrift',
  'Minimalist',
  'High Luxury',
  'Avant-Garde',
  'Upcycled / DIY',
  'Monochrome',
  'Tailoring'
];

export default function AuthModal({ isOpen, onClose, initialMode = 'signup' }: AuthModalProps) {
  const { login, signup } = useStore();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Streetwear', 'Vintage / Thrift']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Google OAuth Sign In / Sign Up
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      if (supabase) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : undefined,
          },
        });
        if (error) throw error;
      }
      // Demo fallback login
      login('google_user@fitmix.app');
      onClose();
    } catch (err: any) {
      console.warn('Supabase OAuth notice:', err?.message);
      // Fallback local sign in
      login('google_user@fitmix.app');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (mode === 'signup') {
        if (!emailOrPhone || !password || !fullName || !username) {
          setErrorMessage('Please fill in all required fields.');
          setIsLoading(false);
          return;
        }

        // Try Supabase auth if email format
        if (emailOrPhone.includes('@') && supabase) {
          try {
            await supabase.auth.signUp({
              email: emailOrPhone,
              password: password,
              options: {
                data: {
                  full_name: fullName,
                  username: username.toLowerCase().replace(/\s+/g, '_'),
                },
              },
            });
          } catch (e) {
            console.log('Supabase signup sync:', e);
          }
        }

        signup({
          username: username.trim().toLowerCase().replace(/\s+/g, '_'),
          displayName: fullName.trim(),
          styleInterests: selectedStyles,
        });

      } else {
        // Sign In
        if (!emailOrPhone || !password) {
          setErrorMessage('Please enter your email/username and password.');
          setIsLoading(false);
          return;
        }

        if (emailOrPhone.includes('@') && supabase) {
          try {
            await supabase.auth.signInWithPassword({
              email: emailOrPhone,
              password: password,
            });
          } catch (e) {
            console.log('Supabase login sync:', e);
          }
        }

        login(emailOrPhone);
      }

      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      {/* Container matching the exact Instagram / Meta auth card layout */}
      <div className="relative w-full max-w-[440px] my-8 rounded-3xl bg-[#12141A] dark:bg-[#12141A] border border-[rgba(255,255,255,0.1)] p-6 sm:p-8 text-white shadow-2xl transition-all">
        
        {/* Top Header Row with Back Button & Close */}
        <div className="flex items-center justify-between pb-3">
          <button
            onClick={() => mode === 'signup' ? setMode('signin') : setMode('signup')}
            className="p-1 rounded-full text-[#8E95A5] hover:text-white transition-colors"
            title="Back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8E95A5] hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Wordmark & Meta-style Header */}
        <div className="text-left mt-2 mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#8E95A5] mb-2 uppercase tracking-widest">
            <span>Fitmix Network</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {mode === 'signup' ? 'Get started on Fitmix' : 'Welcome back to Fitmix'}
          </h2>
          
          <p className="text-xs sm:text-sm text-[#8E95A5] mt-1.5 leading-relaxed">
            {mode === 'signup' 
              ? 'Sign up to post pieces, remix community looks, and share your closet.' 
              : 'Log in to see your digital wardrobe and new community remixes.'}
          </p>
        </div>

        {/* Google One-Tap Auth Button */}
        <div className="mb-5">
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-gray-100 text-[#0D0E12] font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-md active:scale-98"
          >
            {/* Google Colorful G SVG Logo */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{mode === 'signup' ? 'Continue with Google' : 'Log in with Google'}</span>
          </button>
        </div>

        {/* Divider (OR) */}
        <div className="flex items-center gap-4 my-5">
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]" />
          <span className="text-[11px] font-bold text-[#8E95A5] uppercase tracking-wider">OR</span>
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]" />
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Main Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Field 1: Mobile number or email */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              {mode === 'signup' ? 'Mobile number or email' : 'Username, phone, or email'}
            </label>
            <input
              type="text"
              required
              placeholder={mode === 'signup' ? 'Mobile number or email' : 'Mobile number or email'}
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#1A1D24] text-white placeholder-[#6B7280] text-xs sm:text-sm border border-[rgba(255,255,255,0.12)] focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] transition-all"
            />
          </div>

          {mode === 'signup' && (
            <p className="text-[11px] text-[#8E95A5] -mt-2 leading-relaxed">
              You may receive remix notifications from us.{' '}
              <span className="text-[#0084FF] cursor-pointer hover:underline">Learn why we ask for contact info</span>
            </p>
          )}

          {/* Field 2: Password with Reveal Toggle */}
          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-11 py-3 rounded-xl bg-[#1A1D24] text-white placeholder-[#6B7280] text-xs sm:text-sm border border-[rgba(255,255,255,0.12)] focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E95A5] hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Additional Signup Fields */}
          {mode === 'signup' && (
            <>
              {/* Field 3: Full Name */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1D24] text-white placeholder-[#6B7280] text-xs sm:text-sm border border-[rgba(255,255,255,0.12)] focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] transition-all"
                />
              </div>

              {/* Field 4: Username */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1D24] text-white placeholder-[#6B7280] text-xs sm:text-sm border border-[rgba(255,255,255,0.12)] focus:outline-none focus:border-[#0084FF] focus:ring-1 focus:ring-[#0084FF] transition-all"
                />
              </div>

              {/* Style Interests */}
              <div>
                <label className="block text-xs font-semibold text-white mb-2 flex items-center justify-between">
                  <span>Style Aesthetics (Pick 2+)</span>
                  <span className="text-[10px] text-[#E2FF66]">Personalize Feed</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {STYLE_PRESETS.map(style => {
                    const isSelected = selectedStyles.includes(style);
                    return (
                      <button
                        key={style}
                        type="button"
                        onClick={() => toggleStyle(style)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-[#E2FF66] text-[#0D0E12] border-[#E2FF66] font-bold shadow-sm'
                            : 'bg-[#1A1D24] text-[#8E95A5] border-[rgba(255,255,255,0.08)] hover:text-white'
                        }`}
                      >
                        {style}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legal & Terms Disclaimers */}
              <div className="space-y-2 pt-1 text-[11px] text-[#8E95A5] leading-relaxed">
                <p>
                  People who use our service may have uploaded your contact information to Fitmix.{' '}
                  <span className="text-[#0084FF] cursor-pointer hover:underline">Learn more</span>.
                </p>
                <p>
                  By tapping Submit, you agree to create an account and to Fitmix&apos;s{' '}
                  <span className="text-[#0084FF] cursor-pointer hover:underline">Terms</span>,{' '}
                  <span className="text-[#0084FF] cursor-pointer hover:underline">Privacy Policy</span> and{' '}
                  <span className="text-[#0084FF] cursor-pointer hover:underline">Cookies Policy</span>.
                </p>
              </div>
            </>
          )}

          {/* Primary Action Button (Blue / High Visibility Accent) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full text-sm font-bold bg-[#0084FF] hover:bg-[#0074E0] text-white shadow-lg transition-all active:scale-98 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : (mode === 'signup' ? 'Submit' : 'Log In')}
            </button>
          </div>

          {/* Secondary Switch Mode Button */}
          <div>
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setMode(mode === 'signup' ? 'signin' : 'signup');
              }}
              className="w-full py-3 rounded-full text-xs sm:text-sm font-semibold bg-transparent hover:bg-white/5 text-white border border-[rgba(255,255,255,0.2)] transition-all"
            >
              {mode === 'signup' ? 'I already have an account' : 'Create new account'}
            </button>
          </div>

        </form>

        {/* Footer Meta Credits */}
        <div className="mt-8 pt-4 border-t border-[rgba(255,255,255,0.08)] flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] text-[#6B7280]">
          <span>About</span>
          <span>Terms</span>
          <span>Privacy</span>
          <span>API</span>
          <span>Help</span>
          <span>© 2026 Fitmix</span>
        </div>

      </div>
    </div>
  );
}
