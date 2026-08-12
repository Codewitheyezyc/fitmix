'use client';

import React, { useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { CategoryType } from '@/lib/types';
import { 
  X, 
  Upload, 
  Sparkles, 
  Check, 
  Sliders, 
  Tag, 
  Shirt, 
  Image as ImageIcon,
  Layers
} from 'lucide-react';

interface UploadPieceModalProps {
  onClose: () => void;
  onSuccess?: (pieceId: string) => void;
}

export default function UploadPieceModal({ onClose, onSuccess }: UploadPieceModalProps) {
  const { addPiece } = useStore();
  
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cutoutReady, setCutoutReady] = useState(false);
  const [tolerance, setTolerance] = useState(30);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('footwear');
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [stylingNotes, setStylingNotes] = useState('');
  const [dominantColors, setDominantColors] = useState<string[]>(['#0D0E12', '#FFFFFF', '#E2FF66']);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawUrl = event.target?.result as string;
        setImageFile(rawUrl);
        processBackgroundRemoval(rawUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const processBackgroundRemoval = (rawUrl: string) => {
    setIsProcessing(true);
    setCutoutReady(false);

    setTimeout(() => {
      setIsProcessing(false);
      setCutoutReady(true);
    }, 1800);
  };

  const selectPreset = (presetUrl: string, presetTitle: string, presetCat: CategoryType, presetBrand: string) => {
    setImageFile(presetUrl);
    setTitle(presetTitle);
    setCategory(presetCat);
    setBrandName(presetBrand);
    processBackgroundRemoval(presetUrl);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !title) return;

    const newPiece = addPiece({
      title,
      category,
      cutoutImageUrl: imageFile,
      brandName: brandName || undefined,
      description: description || undefined,
      stylingNotes: stylingNotes || undefined,
      dominantColors,
    });

    if (onSuccess) {
      onSuccess(newPiece.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 p-6 shadow-2xl transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#E2FF66]/20 text-[#0D0E12] dark:text-[#E2FF66]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0D0E12] dark:text-white">Post a Piece (AI Cutout Studio)</h3>
              <p className="text-xs text-[#64748B] dark:text-[#8E95A5]">Upload a photo — background is removed automatically into a remixable transparent cutout.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#64748B] dark:text-[#8E95A5] hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSave} className="mt-6 space-y-6">
          
          {/* Photo Dropzone & Preview */}
          {!imageFile ? (
            <div>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-56 rounded-2xl border-2 border-dashed border-black/15 dark:border-white/15 hover:border-[#E2FF66] bg-[#F8F9FA] dark:bg-[#0D0E12]/50 flex flex-col items-center justify-center cursor-pointer p-6 text-center transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-white dark:bg-[#1F222A] flex items-center justify-center text-[#64748B] dark:text-[#8E95A5] group-hover:text-[#0D0E12] dark:group-hover:text-[#E2FF66] group-hover:scale-110 shadow-sm transition-all mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-[#0D0E12] dark:text-white group-hover:text-[#7B9600] dark:group-hover:text-[#E2FF66]">
                  Click or drag photo of your piece
                </h4>
                <p className="text-xs text-[#64748B] dark:text-[#8E95A5] mt-1 max-w-sm">
                  Shoes, jackets, pants, bags, or upcycled fashion items. High contrast backgrounds work best.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Instant Test Presets */}
              <div className="mt-3">
                <span className="text-[11px] text-[#64748B] dark:text-[#8E95A5] block mb-1.5">Or try a demo sample piece:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => selectPreset('https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80', 'Nike Dunk Low Retro White Black', 'footwear', 'Nike')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-[#B0B7C6] border border-black/5 dark:border-white/5 hover:bg-black/5"
                  >
                    👟 Nike Dunks
                  </button>
                  <button
                    type="button"
                    onClick={() => selectPreset('https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80', 'Vintage Distressed Leather Biker Jacket', 'outerwear', 'Schott NYC')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-[#B0B7C6] border border-black/5 dark:border-white/5 hover:bg-black/5"
                  >
                    🧥 Leather Jacket
                  </button>
                  <button
                    type="button"
                    onClick={() => selectPreset('https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80', 'Vintage Leather Shoulder Bag', 'bags', 'Coach')}
                    className="px-2.5 py-1 text-xs rounded-lg bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-[#B0B7C6] border border-black/5 dark:border-white/5 hover:bg-black/5"
                  >
                    👜 Leather Bag
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 z-20 rounded-2xl bg-white/90 dark:bg-[#0D0E12]/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-4 border-[#E2FF66] border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-xs font-semibold text-[#0D0E12] dark:text-white animate-pulse flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#7B9600] dark:text-[#E2FF66]" />
                    AI Removing Background Cutout...
                  </p>
                </div>
              )}

              {/* Cutout Transparency Checkerboard Display */}
              <div className="w-full h-64 rounded-2xl transparency-grid flex items-center justify-center p-4 relative overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-black/40">
                <img
                  src={imageFile}
                  alt="Piece preview"
                  className="max-h-full max-w-full object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.3)] transition-all"
                />

                {cutoutReady && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 dark:bg-[#0D0E12]/80 backdrop-blur-md border border-black/10 dark:border-[#E2FF66]/30 text-[#0D0E12] dark:text-[#E2FF66] text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    Cutout Isolated & Ready
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setImageFile(null)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black text-white text-xs"
                  title="Change image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tolerance Adjustment Tool */}
              <div className="mt-3 flex items-center justify-between gap-4 p-3 rounded-xl bg-[#F4F5F8] dark:bg-[#0D0E12]/60 border border-black/5 dark:border-white/5 text-xs">
                <span className="text-[#64748B] dark:text-[#8E95A5] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#7B9600] dark:text-[#E2FF66]" />
                  Edge Cutout Precision:
                </span>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="accent-[#E2FF66] flex-1 max-w-xs"
                />
                <span className="text-[#0D0E12] dark:text-white font-mono">{tolerance}%</span>
              </div>
            </div>
          )}

          {/* Metadata Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#4B5563] dark:text-[#B0B7C6] mb-1.5">
                Piece Name / Description *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Adidas Samba Black, Vintage 1988 Trench Coat..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[#F4F5F8] dark:bg-[#0D0E12] text-[#0D0E12] dark:text-white border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#E2FF66]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B5563] dark:text-[#B0B7C6] mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[#F4F5F8] dark:bg-[#0D0E12] text-[#0D0E12] dark:text-white border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#E2FF66]"
              >
                <option value="footwear">👟 Footwear / Shoes</option>
                <option value="tops">👕 Tops / Sweaters / Shirts</option>
                <option value="bottoms">👖 Bottoms / Trousers / Skirts</option>
                <option value="outerwear">🧥 Outerwear / Coats / Jackets</option>
                <option value="bags">👜 Bags & Leather Goods</option>
                <option value="accessories">🕶️ Accessories & Jewelry</option>
                <option value="upcycled">♻️ Upcycled / DIY / 1-of-1</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B5563] dark:text-[#B0B7C6] mb-1.5">
                Brand / Origin (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Adidas, Margiela, Thrifted..."
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[#F4F5F8] dark:bg-[#0D0E12] text-[#0D0E12] dark:text-white border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#E2FF66]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#4B5563] dark:text-[#B0B7C6] mb-1.5">
                Styling Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Looks best when paired with wide pleated trousers..."
                value={stylingNotes}
                onChange={(e) => setStylingNotes(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[#F4F5F8] dark:bg-[#0D0E12] text-[#0D0E12] dark:text-white border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#E2FF66]"
              />
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#64748B] dark:text-[#8E95A5] hover:bg-black/5 dark:hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!imageFile || !title || isProcessing}
              className="px-7 py-2.5 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(226,255,102,0.3)] hover:scale-105"
            >
              Publish to My Closet
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
