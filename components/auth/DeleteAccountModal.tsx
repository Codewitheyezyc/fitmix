'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import {
  AlertTriangle,
  Trash2,
  X,
  ArrowRight,
  CheckCircle2,
  Shirt,
  Layers,
  MessageCircle,
  Bell,
  UserX,
  Loader2,
  ShieldAlert
} from 'lucide-react';

interface DeleteAccountModalProps {
  onClose: () => void;
}

const DELETION_REASONS = [
  { id: 'fresh_start', label: 'Starting fresh with a clean wardrobe' },
  { id: 'duplicate', label: 'Created a duplicate or test account' },
  { id: 'privacy', label: 'Privacy or data security concerns' },
  { id: 'features', label: 'Missing features or styling tools' },
  { id: 'temporary', label: 'Just taking a break' },
  { id: 'other', label: 'Other reason' }
];

export default function DeleteAccountModal({ onClose }: DeleteAccountModalProps) {
  const router = useRouter();
  const { currentUser, deleteAccount } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedReason, setSelectedReason] = useState<string>('fresh_start');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [confirmInput, setConfirmInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionStatusText, setDeletionStatusText] = useState('Initiating account deletion...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const targetConfirmValue = currentUser.username || 'DELETE';
  const isConfirmValid = confirmInput.trim().toLowerCase() === targetConfirmValue.toLowerCase() || confirmInput.trim() === 'DELETE';

  const handleFinalDelete = async () => {
    if (!isConfirmValid || isDeleting) return;

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      setDeletionStatusText('Wiping wardrobe pieces & lookboard mixes...');
      await new Promise(r => setTimeout(r, 600));

      setDeletionStatusText('Purging chats, comments & notifications...');
      await new Promise(r => setTimeout(r, 600));

      setDeletionStatusText('Deleting profile and CDN storage records...');
      const success = await deleteAccount(`${selectedReason}: ${feedbackNotes}`);

      if (success) {
        setDeletionStatusText('Account permanently wiped. Redirecting...');
        await new Promise(r => setTimeout(r, 600));
        onClose();
        router.push('/');
      } else {
        throw new Error('Could not complete database wipe. Please check your connection.');
      }
    } catch (err: any) {
      console.error('Account deletion error:', err);
      setErrorMessage(err.message || 'Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Click outside to close (disabled while deleting) */}
      <div className="fixed inset-0" onClick={isDeleting ? undefined : onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-[#16181E] rounded-3xl border border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.15)] overflow-hidden z-10">
        
        {/* Top Danger Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500" />

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0D0E12] dark:text-white flex items-center gap-2">
                <span>Delete Account</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
                  Permanent
                </span>
              </h3>
              <p className="text-xs text-[#64748B] dark:text-[#8E95A5]">
                Step {step} of 3 • @{currentUser.username || 'user'}
              </p>
            </div>
          </div>

          {!isDeleting && (
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6">

          {/* ─── STEP 1: Reason Selection ───────────────────────────── */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h4 className="text-sm font-bold text-[#0D0E12] dark:text-white">
                  Why are you deleting your account?
                </h4>
                <p className="text-xs text-[#64748B] dark:text-[#8E95A5] mt-1">
                  We are constantly improving FitMix. Your feedback helps our design and engineering team.
                </p>
              </div>

              <div className="space-y-2">
                {DELETION_REASONS.map(reason => {
                  const isSelected = selectedReason === reason.id;
                  return (
                    <div
                      key={reason.id}
                      onClick={() => setSelectedReason(reason.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                        isSelected
                          ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-300 font-semibold shadow-xs'
                          : 'bg-[#F8F9FA] dark:bg-[#12141A] border-black/5 dark:border-white/5 text-[#0D0E12] dark:text-white hover:border-black/20 dark:hover:border-white/20'
                      }`}
                    >
                      <span>{reason.label}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-rose-500 bg-rose-500 text-white' : 'border-black/20 dark:border-white/20'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0D0E12] dark:text-[#8E95A5] mb-1.5">
                  Optional feedback or notes
                </label>
                <textarea
                  rows={2}
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  placeholder="Tell us what we can do better..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F8F9FA] dark:bg-[#12141A] text-xs text-[#0D0E12] dark:text-white border border-black/10 dark:border-white/10 focus:outline-none focus:border-rose-500 transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 2: Impact & Permanent Destruction Review ─────── */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Warning: This action is permanent and irreversible</span>
                </div>
                <p className="text-[11px] text-rose-600/80 dark:text-rose-300/80 leading-relaxed">
                  Once deleted, your account and all associated creative work cannot be recovered by you or our support team.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8E95A5] mb-2.5">
                  The following data will be completely wiped:
                </h4>
                <div className="space-y-2">
                  {[
                    { icon: Shirt, label: 'Your Digital Wardrobe', desc: 'All uploaded clothing pieces & transparent AI cutout assets' },
                    { icon: Layers, label: 'Outfit Lookboard Mixes', desc: 'All styling collages, technique tags, and remix chains' },
                    { icon: MessageCircle, label: 'Conversations & Comments', desc: 'All sent direct messages, emoji reactions, and mix comments' },
                    { icon: Bell, label: 'Social Graph & Notifications', desc: 'All follower links, activity notifications, and styling stories' },
                    { icon: UserX, label: 'Profile & Storage CDN', desc: 'Your username, avatar image, and personal profile records' },
                  ].map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="p-3 rounded-2xl bg-[#F8F9FA] dark:bg-[#12141A] border border-black/5 dark:border-white/5 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0D0E12] dark:text-white">{label}</p>
                        <p className="text-[11px] text-[#64748B] dark:text-[#8E95A5]">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>I Understand, Proceed</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP 3: Verification & Destructive Confirmation ────── */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {isDeleting ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-500 animate-spin">
                    <Loader2 className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#0D0E12] dark:text-white">
                      Deleting FitMix Account
                    </h4>
                    <p className="text-xs text-[#64748B] dark:text-[#8E95A5] font-medium">
                      {deletionStatusText}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto">
                      <Trash2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-[#0D0E12] dark:text-white">
                      Final Security Verification
                    </h4>
                    <p className="text-xs text-[#64748B] dark:text-[#8E95A5] max-w-sm mx-auto">
                      To confirm deletion of your account and all data, please type{' '}
                      <span className="font-mono font-bold text-[#0D0E12] dark:text-white bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded">
                        {currentUser.username || 'DELETE'}
                      </span>{' '}
                      below:
                    </p>
                  </div>

                  <div>
                    <input
                      type="text"
                      autoFocus
                      placeholder={`Type ${currentUser.username || 'DELETE'}`}
                      value={confirmInput}
                      onChange={(e) => setConfirmInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#F8F9FA] dark:bg-[#12141A] text-[#0D0E12] dark:text-white font-mono text-center text-sm border border-black/10 dark:border-white/10 focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      type="button"
                      disabled={!isConfirmValid || isDeleting}
                      onClick={handleFinalDelete}
                      className="w-full py-3 rounded-full text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-700 active:scale-98 disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Permanently Delete My Account & Wipe Data</span>
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-2.5 rounded-full text-xs font-semibold text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white transition-colors"
                    >
                      Nevermind, Keep My Account
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
