'use client';

import React, { useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { CategoryType } from '@/lib/types';
import { removeGarmentBackground } from '@/lib/cutoutEngine';
import { uploadImageToStorage } from '@/lib/storageUpload';
import { 
  X, 
  Upload, 
  Sparkles, 
  Check, 
  Sliders, 
  Tag, 
  Shirt, 
  Image as ImageIcon,
  Layers,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface UploadPieceModalProps {
  onClose: () => void;
  onSuccess?: (pieceId: string) => void;
}

export default function UploadPieceModal({ onClose, onSuccess }: UploadPieceModalProps) {
  const { addPiece, users, currentUser } = useStore();
  
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [rawSourceUrl, setRawSourceUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cutoutReady, setCutoutReady] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [processStatusText, setProcessStatusText] = useState('Initializing AI Cutout...');
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
        setRawSourceUrl(rawUrl);
        processBackgroundRemoval(rawUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const [showOriginal, setShowOriginal] = useState(false);

  const processBackgroundRemoval = async (source: string | File | Blob, customTolerance?: number) => {
    setIsProcessing(true);
    setCutoutReady(false);
    setProcessProgress(10);
    setProcessStatusText('Starting In-Browser AI Engine...');

    try {
      const cutoutDataUrl = await removeGarmentBackground(
        source, 
        (pct, status) => {
          setProcessProgress(pct);
          setProcessStatusText(status);
        },
        { tolerance: customTolerance ?? tolerance }
      );

      setImageFile(cutoutDataUrl);
      setCutoutReady(true);
    } catch (err) {
      console.error('Background removal failed:', err);
      if (typeof source === 'string') {
        setImageFile(source);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const selectPreset = (presetUrl: string, presetTitle: string, presetCat: CategoryType, presetBrand: string) => {
    setRawSourceUrl(presetUrl);
    setTitle(presetTitle);
    setCategory(presetCat);
    setBrandName(presetBrand);
    processBackgroundRemoval(presetUrl);
  };

  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !title) return;

    setIsSaving(true);
    setUploadError(null);
    try {
      let finalImageUrl = imageFile;
      if (imageFile.startsWith('data:')) {
        finalImageUrl = await uploadImageToStorage(imageFile, 'pieces', `piece_${title.toLowerCase().replace(/\s+/g, '_')}`);
      }

      const newPiece = addPiece({
        title,
        category,
        cutoutImageUrl: finalImageUrl,
        brandName: brandName || undefined,
        description: description || undefined,
        stylingNotes: stylingNotes || undefined,
        dominantColors,
      });

      if (onSuccess) {
        onSuccess(newPiece.id);
      }
      onClose();
    } catch (err: any) {
      console.error('Error saving piece:', err);
      setUploadError(err?.message || 'Could not upload piece image. Please check your internet connection and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Click outside to close backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Bottom Sheet / Modal Card */}
      <div className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[85vh] rounded-t-[32px] sm:rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col z-10 transition-colors">
        
        {/* Mobile Pull Drag Indicator */}
        <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mx-auto mt-3 mb-1 sm:hidden flex-shrink-0" />

        {/* Sticky Header */}
        <div className="p-4 sm:p-5 border-b border-black/5 dark:border-white/5 flex items-center justify-between gap-3 bg-white/90 dark:bg-[#16181E]/90 backdrop-blur-md sticky top-0 z-20 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#E2FF66]/20 text-[#0D0E12] dark:text-[#E2FF66] flex items-center justify-center flex-shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-[#0D0E12] dark:text-white truncate">
                AI Cutout Studio (Automatic Background Removal)
              </h3>
              <p className="text-[11px] text-[#64748B] dark:text-[#8E95A5] truncate">
                Upload any photo — neural AI removes the background into a transparent cutout.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#64748B] dark:text-[#8E95A5] hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin">
          
          {/* Upload Error Banner */}
          {uploadError && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in">
              <span>{uploadError}</span>
              <button 
                type="button" 
                onClick={() => setUploadError(null)}
                className="p-1 rounded-full hover:bg-rose-500/20 text-rose-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Photo Dropzone & Preview */}
          {!imageFile && !isProcessing ? (
            <div className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-52 sm:h-56 rounded-2xl border-2 border-dashed border-black/15 dark:border-white/15 hover:border-[#E2FF66] bg-gradient-to-b from-[#F8F9FA] to-[#F1F3F7] dark:from-[#12141A] dark:to-[#0D0E12] flex flex-col items-center justify-center cursor-pointer p-6 text-center transition-all group shadow-inner"
              >
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1F222A] flex items-center justify-center text-[#64748B] dark:text-[#8E95A5] group-hover:text-[#0D0E12] dark:group-hover:text-[#E2FF66] group-hover:scale-110 shadow-md transition-all mb-2.5">
                  <Upload className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0D0E12] dark:text-white group-hover:text-[#7B9600] dark:group-hover:text-[#E2FF66]">
                  Click or drag photo of your garment
                </h4>
                <p className="text-[11px] text-[#64748B] dark:text-[#8E95A5] mt-1 max-w-sm px-2">
                  Shoes, jackets, pants, bags, or upcycled fashion items. Zero API keys needed — runs directly in your browser.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Demo Presets Chips */}
              <div className="pt-1">
                <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#8E95A5] block mb-2">
                  Or test with sample items:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => selectPreset('https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80', 'Nike Dunk Low Retro White Black', 'footwear', 'Nike')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white border border-black/5 dark:border-white/5 hover:border-[#E2FF66] transition-colors"
                  >
                    👟 Nike Dunks
                  </button>
                  <button
                    type="button"
                    onClick={() => selectPreset('https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80', 'Vintage Distressed Leather Biker Jacket', 'outerwear', 'Schott NYC')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white border border-black/5 dark:border-white/5 hover:border-[#E2FF66] transition-colors"
                  >
                    🧥 Leather Jacket
                  </button>
                  <button
                    type="button"
                    onClick={() => selectPreset('https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80', 'Vintage Leather Shoulder Bag', 'bags', 'Coach')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white border border-black/5 dark:border-white/5 hover:border-[#E2FF66] transition-colors"
                  >
                    👜 Leather Bag
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative space-y-3">
              
              {/* Processing Overlay */}
              {isProcessing && (
                <div className="w-full h-60 sm:h-64 rounded-2xl bg-[#0D0E12] flex flex-col items-center justify-center p-6 text-center border border-black/10 dark:border-white/10 shadow-inner">
                  <div className="w-12 h-12 border-4 border-[#E2FF66] border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_20px_rgba(226,255,102,0.4)]" />
                  
                  <p className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#E2FF66] animate-bounce" />
                    <span>{processStatusText}</span>
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="w-64 h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#E2FF66] to-[#A3E635] transition-all duration-300 rounded-full"
                      style={{ width: `${processProgress}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-[#8E95A5] mt-1.5 font-bold">
                    {processProgress}% completed
                  </span>
                </div>
              )}

              {/* Cutout Display with Transparency Grid Checkboard */}
              {!isProcessing && imageFile && (
                <div 
                  className="w-full h-60 sm:h-64 rounded-2xl flex items-center justify-center p-4 relative overflow-hidden border border-black/10 dark:border-white/10 shadow-inner"
                  style={{
                    backgroundColor: '#12141A',
                    backgroundImage: 'radial-gradient(rgba(226, 255, 102, 0.15) 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                  }}
                >
                  <img
                    src={showOriginal && rawSourceUrl ? rawSourceUrl : imageFile}
                    alt="Piece preview"
                    className="max-h-full max-w-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.45)] transition-all"
                  />

                  {cutoutReady && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#E2FF66]/40 text-[#E2FF66] text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                      <Check className="w-3.5 h-3.5 text-[#E2FF66]" />
                      {showOriginal ? 'Viewing Original Photo' : 'Background Removed • Transparent Cutout'}
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {rawSourceUrl && (
                      <button
                        type="button"
                        onClick={() => setShowOriginal(o => !o)}
                        className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition-colors shadow-md ${
                          showOriginal ? 'bg-[#E2FF66] text-[#0D0E12]' : 'bg-black/70 hover:bg-black text-white'
                        }`}
                        title="Toggle Original vs Cutout"
                      >
                        {showOriginal ? 'Show Cutout' : 'Show Original'}
                      </button>
                    )}
                    {rawSourceUrl && (
                      <button
                        type="button"
                        onClick={() => processBackgroundRemoval(rawSourceUrl, tolerance)}
                        className="p-2 rounded-full bg-black/70 hover:bg-black text-white text-xs shadow-md transition-colors"
                        title="Re-run cutout"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setRawSourceUrl(null);
                      }}
                      className="p-2 rounded-full bg-black/70 hover:bg-black text-white text-xs shadow-md transition-colors"
                      title="Upload different image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Edge Precision & Live Tolerance Slider */}
              {!isProcessing && cutoutReady && (
                <div className="p-3.5 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#64748B] dark:text-[#8E95A5] flex items-center gap-1.5 font-semibold">
                      <Sliders className="w-3.5 h-3.5 text-[#7B9600] dark:text-[#E2FF66]" />
                      Background Removal Strength:
                    </span>
                    <span className="text-[#7B9600] dark:text-[#E2FF66] font-mono font-bold text-xs">
                      {tolerance}%
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-[#94A3B8]">Gentle</span>
                    <input
                      type="range"
                      min="20"
                      max="85"
                      value={tolerance}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setTolerance(val);
                        if (rawSourceUrl) {
                          processBackgroundRemoval(rawSourceUrl, val);
                        }
                      }}
                      className="flex-1 accent-[#E2FF66] cursor-pointer h-1.5 bg-black/10 dark:bg-white/10 rounded-lg"
                    />
                    <span className="text-[10px] text-[#94A3B8]">Aggressive</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Metadata Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#0D0E12] dark:text-white mb-1">
                Piece Name / Description *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Nike Air Force 1, Vintage Leather Trench Coat..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white placeholder-[#94A3B8] dark:placeholder-[#737373] border border-black/5 dark:border-white/5 focus:outline-none focus:border-[#E2FF66] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0D0E12] dark:text-white mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white border border-black/5 dark:border-white/5 focus:outline-none focus:border-[#E2FF66] transition-colors cursor-pointer"
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
              <label className="block text-xs font-semibold text-[#0D0E12] dark:text-white mb-1">
                Brand / Origin (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Nike, Levi's, Uniqlo, Vintage..."
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white placeholder-[#94A3B8] dark:placeholder-[#737373] border border-black/5 dark:border-white/5 focus:outline-none focus:border-[#E2FF66] transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#0D0E12] dark:text-white mb-1">
                Styling Notes (Optional - mention stylists with @)
              </label>
              <input
                type="text"
                placeholder="e.g. Looks great with @elena_v's wool trench coat..."
                value={stylingNotes}
                onChange={(e) => setStylingNotes(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white placeholder-[#94A3B8] dark:placeholder-[#737373] border border-black/5 dark:border-white/5 focus:outline-none focus:border-[#E2FF66] transition-colors"
              />
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 text-[11px]">
                <span className="text-[#64748B] dark:text-[#8E95A5] text-[10px] font-semibold flex-shrink-0">
                  Mention Stylist:
                </span>
                {users.filter(u => u.id !== currentUser.id).slice(0, 5).map(u => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setStylingNotes(prev => prev ? `${prev} @${u.username} ` : `@${u.username} `)}
                    className="px-2 py-0.5 rounded-full bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white border border-black/5 dark:border-white/5 hover:border-[#E2FF66] text-[10px] font-medium flex-shrink-0"
                  >
                    @{u.username}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Sticky Bottom Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#64748B] dark:text-[#8E95A5] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!imageFile || !title || isProcessing || isSaving}
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(226,255,102,0.3)] hover:scale-102 active:scale-95 flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Syncing to Cloud...</span>
                </>
              ) : (
                <span>Publish to My Closet</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
