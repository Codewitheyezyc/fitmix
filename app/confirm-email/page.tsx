'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, CheckCircle2, ArrowRight, RefreshCw, ChevronLeft } from 'lucide-react';

function ConfirmEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your email';
  const [isResent, setIsResent] = useState(false);

  const handleResend = () => {
    setIsResent(true);
    setTimeout(() => setIsResent(false), 5000);
  };

  return (
    <div className="w-full max-w-[440px] mx-auto text-center transition-all">
      
      {/* Back to Home */}
      <div className="text-left mb-6">
        <Link 
          href="/" 
          className="inline-flex p-1 -ml-1 text-[#64748B] dark:text-[#A8A8A8] hover:text-[#0D0E12] dark:hover:text-white transition-colors"
          aria-label="Back to Home"
        >
          <ChevronLeft className="w-7 h-7" />
        </Link>
      </div>

      {/* Mail Envelope Icon */}
      <div className="w-20 h-20 mx-auto rounded-3xl bg-[#E2FF66]/15 dark:bg-[#E2FF66]/20 border border-[#E2FF66]/30 flex items-center justify-center text-[#0D0E12] dark:text-[#E2FF66] mb-6 shadow-lg shadow-[#E2FF66]/10 animate-in zoom-in-95 duration-300">
        <Mail className="w-10 h-10" />
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0D0E12] dark:text-[#F5F5F5] mb-2">
        Check your email
      </h1>

      {/* Description */}
      <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#A8A8A8] leading-relaxed mb-6">
        We&apos;ve sent a verification link to <br />
        <strong className="text-[#0D0E12] dark:text-white font-bold">{email}</strong>. <br />
        Please click the link in your inbox to confirm your account.
      </p>

      {/* Verification Instructions Box */}
      <div className="p-4 rounded-2xl bg-[#F4F5F8] dark:bg-[#1E1E1E] border border-black/5 dark:border-[#363636] text-left text-xs text-[#64748B] dark:text-[#A8A8A8] space-y-2 mb-6">
        <div className="flex items-center gap-2 text-[#0D0E12] dark:text-white font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>Almost ready to remix!</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          1. Open your email inbox and tap <strong>Verify Email Address</strong>.<br />
          2. Return here to log in and access your personal closet.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Link
          href="/login"
          className="w-full py-3.5 rounded-full text-sm font-bold bg-[#E2FF66] hover:bg-[#d5f356] text-[#0D0E12] shadow-[0_0_20px_rgba(226,255,102,0.3)] transition-all active:scale-98 flex items-center justify-center gap-2"
        >
          <span>I&apos;ve confirmed my email — Log In</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <button
          type="button"
          onClick={handleResend}
          disabled={isResent}
          className="w-full py-3 rounded-full text-xs font-semibold bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-[#64748B] dark:text-[#A8A8A8] border border-black/15 dark:border-[#363636] transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isResent ? 'animate-spin' : ''}`} />
          <span>{isResent ? 'Verification link resent!' : 'Didn\'t get an email? Resend'}</span>
        </button>
      </div>

      {/* Footer Brand Links */}
      <div className="mt-12 pt-6 border-t border-black/5 dark:border-[#262626] flex items-center justify-center gap-x-4 text-[11px] text-[#94A3B8] dark:text-[#737373]">
        <Link href="#" className="hover:underline">Privacy</Link>
        <span>•</span>
        <Link href="#" className="hover:underline">Terms</Link>
        <span>•</span>
        <Link href="#" className="hover:underline">Help</Link>
      </div>

      <div className="mt-3 text-center text-[11px] text-[#94A3B8] dark:text-[#737373]">
        © 2026 Fitmix. All rights reserved.
      </div>

    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen py-12 px-4 flex flex-col items-center justify-center bg-[#FAFAFC] dark:bg-[#121212] transition-colors duration-200">
      <Suspense fallback={<div className="text-center text-xs text-[#64748B]">Loading...</div>}>
        <ConfirmEmailContent />
      </Suspense>
    </div>
  );
}
