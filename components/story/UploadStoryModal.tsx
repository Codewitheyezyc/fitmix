'use client';

import React, { useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { 
  X, 
  Upload, 
  Sparkles, 
  Check, 
  Tag, 
  Image as ImageIcon, 
  Send,
  Plus
} from 'lucide-react';

interface UploadStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function UploadStoryModal({ isOpen, onClose, onSuccess }: UploadStoryModalProps) {
  const { addStory, currentUser, pieces, users } = useStore();
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedPieceId, setSelectedPieceId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageFile(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (url: string, defaultCaption: string) => {
    setImageFile(url);
    setCaption(defaultCaption);
  };

  const handleMentionInsert = (username: string) => {
    setCaption(prev => prev ? `${prev} @${username} ` : `@${username} `);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;

    setIsSubmitting(true);
    const taggedPiece = pieces.find(p => p.id === selectedPieceId);

    addStory({
      imageUrl: imageFile,
      caption: caption.trim(),
      pieceId: selectedPieceId || undefined,
      title: taggedPiece?.title || 'Outfit Mood',
      category: taggedPiece?.category || 'Look'
    });

    setIsSubmitting(false);
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[92vh] sm:max-h-[85vh] rounded-t-[32px] sm:rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col z-10 transition-colors">
        
        {/* Mobile Pull Indicator */}
        <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mx-auto mt-3 mb-1 sm:hidden flex-shrink-0" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-black/5 dark:border-white/5 flex items-center justify-between gap-3 bg-white/90 dark:bg-[#16181E]/90 backdrop-blur-md sticky top-0 z-20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#E2FF66]/20 text-[#0D0E12] dark:text-[#E2FF66] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#0D0E12] dark:text-white">
                Add to Your Story
              </h3>
              <p className="text-[11px] text-[#64748B] dark:text-[#8E95A5]">
                Disappears automatically after 24 hours.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#64748B] dark:text-[#8E95A5] hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
          
          {/* Photo Dropzone or Preview */}
          {!imageFile ? (
            <div className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-64 rounded-2xl border-2 border-dashed border-black/15 dark:border-white/15 hover:border-[#E2FF66] bg-gradient-to-b from-[#F8F9FA] to-[#F1F3F7] dark:from-[#12141A] dark:to-[#0D0E12] flex flex-col items-center justify-center cursor-pointer p-6 text-center transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1F222A] flex items-center justify-center text-[#64748B] dark:text-[#8E95A5] group-hover:text-[#0D0E12] dark:group-hover:text-[#E2FF66] group-hover:scale-110 shadow-md transition-all mb-2.5">
                  <Upload className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0D0E12] dark:text-white group-hover:text-[#7B9600] dark:group-hover:text-[#E2FF66]">
                  Click or drag a photo for your story
                </h4>
                <p className="text-[11px] text-[#64748B] dark:text-[#8E95A5] mt-1 max-w-xs">
                  Full-length fit pictures, new wardrobe additions, or moodboard inspiration.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Sample Quick Stories */}
              <div className="pt-1">
                <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#8E95A5] block mb-2">
                  Or test with sample outfit photos:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handlePresetSelect('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80', 'Today’s monochrome styling experiment.')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white border border-black/5 dark:border-white/5 hover:border-[#E2FF66]"
                  >
                    ✨ Street Look
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect('https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80', 'Casual tailoring & everyday sneakers.')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white border border-black/5 dark:border-white/5 hover:border-[#E2FF66]"
                  >
                    🧥 Trench Styling
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetSelect('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80', 'Parisian vintage market finds.')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white border border-black/5 dark:border-white/5 hover:border-[#E2FF66]"
                  >
                    🛍️ Market Haul
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden bg-black/90 aspect-[9/16] max-h-[380px] flex items-center justify-center">
              <img
                src={imageFile}
                alt="Story preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImageFile(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black text-white text-xs shadow-md"
                title="Change image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Story Caption */}
          <div>
            <label className="block text-xs font-semibold text-[#0D0E12] dark:text-white mb-1">
              Caption (Optional - mention stylists with @)
            </label>
            <input
              type="text"
              placeholder="e.g. Vintage styling inspired by @elena_v..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white text-xs sm:text-sm border border-black/5 dark:border-white/5 focus:outline-none focus:border-[#E2FF66]"
            />
            {/* Stylist Quick Mention Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 text-[11px]">
              <span className="text-[#64748B] dark:text-[#8E95A5] text-[10px] font-semibold flex-shrink-0">
                Mention Stylist:
              </span>
              {users.filter(u => u.id !== currentUser.id).map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleMentionInsert(u.username)}
                  className="px-2 py-0.5 rounded-full bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white border border-black/5 dark:border-white/5 hover:border-[#E2FF66] text-[10px] font-medium flex-shrink-0"
                >
                  @{u.username}
                </button>
              ))}
            </div>
          </div>

          {/* Tag a Garment from Closet */}
          <div>
            <label className="block text-xs font-semibold text-[#0D0E12] dark:text-white mb-1">
              Tag a Clothing Piece (Optional)
            </label>
            <select
              value={selectedPieceId}
              onChange={(e) => setSelectedPieceId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white text-xs sm:text-sm border border-black/5 dark:border-white/5 focus:outline-none focus:border-[#E2FF66] cursor-pointer"
            >
              <option value="">None (General Mood / Fit)</option>
              {pieces.map(piece => (
                <option key={piece.id} value={piece.id}>
                  {piece.title} ({piece.category})
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-black/5 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs text-[#64748B] dark:text-[#8E95A5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!imageFile || isSubmitting}
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] disabled:opacity-40 shadow-md transition-all hover:scale-102"
            >
              {isSubmitting ? 'Posting...' : 'Share to Story'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
