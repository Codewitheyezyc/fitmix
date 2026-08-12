'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Piece, MixLayer, CanvasBackground, Mix } from '@/lib/types';
import { FASHION_TECHNIQUES } from '@/lib/seedData';
import { 
  ArrowLeft, 
  Layers, 
  RotateCw, 
  FlipHorizontal, 
  Trash2, 
  Plus, 
  ZoomIn, 
  ZoomOut, 
  Sparkles, 
  X, 
  Check, 
  Share2, 
  Save, 
  ArrowUp, 
  ArrowDown,
  Info,
  UserCheck,
  UserPlus,
  Users
} from 'lucide-react';

export default function RemixCanvasEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const remixMixId = searchParams.get('remixMixId');
  const preloadPieceId = searchParams.get('preloadPieceId');

  const { 
    pieces, 
    mixes, 
    currentUser, 
    users,
    toggleFollowUser,
    createMix, 
    getPiecesByOwner 
  } = useStore();

  const canvasRef = useRef<HTMLDivElement>(null);

  // Canvas State
  const [layers, setLayers] = useState<MixLayer[]>([]);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number | null>(null);
  const [backgroundTheme, setBackgroundTheme] = useState<CanvasBackground>('obsidian');

  // Modal States
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [pickerTab, setPickerTab] = useState<'followed' | 'closet' | 'explore'>('followed');
  const [pickerCategory, setPickerCategory] = useState<string>('all');

  // Form publish state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTechniques, setSelectedTechniques] = useState<string[]>(['Streetwear x Formal']);
  const [whyItWorks, setWhyItWorks] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // Dragging State
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragLayerInitialPos, setDragLayerInitialPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Initial Load Handler
  useEffect(() => {
    if (remixMixId) {
      const sourceMix = mixes.find(m => m.id === remixMixId);
      if (sourceMix) {
        setLayers(sourceMix.layers.map(l => ({ ...l })));
        setBackgroundTheme(sourceMix.canvasBackground || 'obsidian');
        setTitle(`Remix of "${sourceMix.title}"`);
        setDescription(`Remixed with custom proportions & layering inspired by @${sourceMix.creatorUsername}.`);
        setSelectedTechniques(sourceMix.techniqueTags || ['Streetwear x Formal']);
        setWhyItWorks(sourceMix.whyItWorks || '');
        return;
      }
    }

    if (preloadPieceId) {
      const p = pieces.find(item => item.id === preloadPieceId);
      if (p) {
        setLayers([
          {
            pieceId: p.id,
            x: 50,
            y: 45,
            scale: 1,
            rotation: 0,
            zIndex: 1,
            flipX: false,
            pieceData: p
          }
        ]);
        setSelectedLayerIndex(0);
        setTitle(`Styling ${p.title}`);
      }
      return;
    }

    // Default starter canvas
    if (pieces.length >= 2 && layers.length === 0) {
      setLayers([
        {
          pieceId: pieces[0].id,
          x: 50,
          y: 35,
          scale: 0.95,
          rotation: 0,
          zIndex: 1,
          flipX: false,
          pieceData: pieces[0]
        },
        {
          pieceId: pieces[3]?.id || pieces[1].id,
          x: 50,
          y: 70,
          scale: 0.95,
          rotation: 0,
          zIndex: 2,
          flipX: false,
          pieceData: pieces[3] || pieces[1]
        }
      ]);
      setSelectedLayerIndex(0);
    }
  }, [remixMixId, preloadPieceId, mixes, pieces]);

  // Selected Layer Reference
  const selectedLayer = selectedLayerIndex !== null ? layers[selectedLayerIndex] : null;

  // Layer Manipulation Handlers
  const updateSelectedLayer = (updates: Partial<MixLayer>) => {
    if (selectedLayerIndex === null) return;
    setLayers(prev => {
      const copy = [...prev];
      copy[selectedLayerIndex] = { ...copy[selectedLayerIndex], ...updates };
      return copy;
    });
  };

  const deleteSelectedLayer = () => {
    if (selectedLayerIndex === null) return;
    setLayers(prev => prev.filter((_, idx) => idx !== selectedLayerIndex));
    setSelectedLayerIndex(null);
  };

  const bringForward = () => {
    if (selectedLayerIndex === null || selectedLayerIndex === layers.length - 1) return;
    setLayers(prev => {
      const copy = [...prev];
      const temp = copy[selectedLayerIndex];
      copy[selectedLayerIndex] = copy[selectedLayerIndex + 1];
      copy[selectedLayerIndex + 1] = temp;
      return copy;
    });
    setSelectedLayerIndex(selectedLayerIndex + 1);
  };

  const sendBackward = () => {
    if (selectedLayerIndex === null || selectedLayerIndex === 0) return;
    setLayers(prev => {
      const copy = [...prev];
      const temp = copy[selectedLayerIndex];
      copy[selectedLayerIndex] = copy[selectedLayerIndex - 1];
      copy[selectedLayerIndex - 1] = temp;
      return copy;
    });
    setSelectedLayerIndex(selectedLayerIndex - 1);
  };

  // Add Piece to Canvas
  const addPieceToCanvas = (piece: Piece) => {
    const newLayer: MixLayer = {
      pieceId: piece.id,
      x: 50 + (Math.random() * 8 - 4),
      y: 50 + (Math.random() * 8 - 4),
      scale: 0.9,
      rotation: Math.floor(Math.random() * 10 - 5),
      zIndex: layers.length + 1,
      flipX: false,
      pieceData: piece
    };
    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerIndex(layers.length);
    setIsPickerOpen(false);
  };

  // Pointer / Drag Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent, index: number) => {
    e.stopPropagation();
    setSelectedLayerIndex(index);
    setIsDragging(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setDragLayerInitialPos({ x: layers[index].x, y: layers[index].y });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || selectedLayerIndex === null || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const deltaXPercent = ((e.clientX - dragStartPos.x) / rect.width) * 100;
    const deltaYPercent = ((e.clientY - dragStartPos.y) / rect.height) * 100;

    const newX = Math.max(10, Math.min(90, dragLayerInitialPos.x + deltaXPercent));
    const newY = Math.max(10, Math.min(90, dragLayerInitialPos.y + deltaYPercent));

    updateSelectedLayer({ x: newX, y: newY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Publish Outfit Mix
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || layers.length === 0) return;

    setIsPublishing(true);

    const newMix: Mix = {
      id: `mix_${Date.now()}`,
      creatorId: currentUser.id,
      creatorUsername: currentUser.username,
      creatorName: currentUser.displayName,
      creatorAvatar: currentUser.avatarUrl,
      title: title.trim(),
      description: description.trim() || 'A new styled collage created on Fitmix Studio.',
      canvasBackground: backgroundTheme,
      techniqueTags: selectedTechniques.length > 0 ? selectedTechniques : ['Casual Styling'],
      whyItWorks: whyItWorks.trim() || 'Balanced proportions and color harmony.',
      layers: layers,
      likesCount: 1,
      commentsCount: 0,
      remixCount: 0,
      isLiked: true,
      isSaved: false,
      createdAt: new Date().toISOString()
    };

    createMix(newMix);
    setIsPublishing(false);
    setIsPublishModalOpen(false);
    router.push('/');
  };

  // Filtered pieces for drawer based on Followed Stylists Permissions
  const followedUserIds = users.filter(u => u.isFollowing).map(u => u.username.toLowerCase());
  
  const filteredPieces = pieces.filter(p => {
    const isMine = p.ownerUsername.toLowerCase() === currentUser.username.toLowerCase();
    const isFollowed = followedUserIds.includes(p.ownerUsername.toLowerCase());

    if (pickerTab === 'closet') {
      if (!isMine) return false;
    } else if (pickerTab === 'followed') {
      if (!isFollowed && !isMine) return false;
    }

    if (pickerCategory !== 'all' && p.category.toLowerCase() !== pickerCategory.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Top Studio Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-black/10 dark:border-white/10">
        
        {/* Back Link */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-full text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#0D0E12] dark:text-white">
              {title || 'Remix Studio Canvas'}
            </h1>
            <p className="text-[11px] text-[#64748B] dark:text-[#8E95A5]">
              Drag, rotate, scale and layer items into an editorial flat-lay.
            </p>
          </div>
        </div>

        {/* Studio Controls */}
        <div className="flex items-center gap-3">
          
          {/* Canvas Background Theme Selector */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/10 dark:border-white/10">
            {(['obsidian', 'paper', 'velvet', 'dark-grid'] as CanvasBackground[]).map(bg => (
              <button
                key={bg}
                onClick={() => setBackgroundTheme(bg)}
                className={`w-6 h-6 rounded-full border transition-transform ${
                  backgroundTheme === bg ? 'scale-110 border-[#E2FF66] shadow-[0_0_8px_rgba(226,255,102,0.5)]' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                style={{
                  backgroundColor:
                    bg === 'obsidian' ? '#0D0E12' :
                    bg === 'paper' ? '#F4F5F8' :
                    bg === 'velvet' ? '#1C162B' :
                    '#12141A'
                }}
                title={`Canvas Background: ${bg}`}
              />
            ))}
          </div>

          {/* Publish CTA Button */}
          <button
            onClick={() => setIsPublishModalOpen(true)}
            disabled={layers.length === 0}
            className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] shadow-[0_0_20px_rgba(226,255,102,0.3)] transition-all hover:scale-105 active:scale-95 disabled:opacity-40 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
            <span>Publish Mix</span>
          </button>
        </div>

      </div>

      {/* Main Studio Viewport: Canvas + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Flat-Lay Canvas Column (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
          <div
            ref={canvasRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={`relative w-full aspect-[4/5] sm:aspect-square max-h-[640px] rounded-3xl border border-black/10 dark:border-white/15 overflow-hidden select-none touch-none shadow-2xl transition-colors ${
              backgroundTheme === 'obsidian' ? 'bg-[#0D0E12]' :
              backgroundTheme === 'paper' ? 'bg-[#FAFAFC]' :
              backgroundTheme === 'velvet' ? 'bg-[#181324]' :
              'bg-[#12141A]'
            }`}
            style={{
              backgroundImage: backgroundTheme === 'dark-grid' ? 'radial-gradient(rgba(226, 255, 102, 0.15) 1px, transparent 1px)' : undefined,
              backgroundSize: '24px 24px'
            }}
          >
            
            {/* Empty State */}
            {layers.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-[#64748B] dark:text-[#8E95A5]">
                <Layers className="w-12 h-12 stroke-[1.5] mb-3 text-[#E2FF66]" />
                <h3 className="text-sm font-bold text-[#0D0E12] dark:text-white">Your Flat-Lay Canvas is Empty</h3>
                <p className="text-xs max-w-xs mt-1 mb-4">Add clothing cutouts from your wardrobe or followed stylists.</p>
                <button
                  onClick={() => setIsPickerOpen(true)}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] shadow-md"
                >
                  + Add First Piece
                </button>
              </div>
            )}

            {/* Interactive Layers */}
            {layers.map((layer, index) => {
              const isSelected = selectedLayerIndex === index;
              return (
                <div
                  key={`${layer.pieceId}-${index}`}
                  onPointerDown={(e) => handlePointerDown(e, index)}
                  className={`absolute cursor-move transition-shadow ${
                    isSelected ? 'ring-2 ring-[#E2FF66] ring-offset-2 ring-offset-black/50 rounded-2xl' : ''
                  }`}
                  style={{
                    left: `${layer.x}%`,
                    top: `${layer.y}%`,
                    transform: `translate(-50%, -50%) scale(${layer.scale || 1}) rotate(${layer.rotation || 0}deg) scaleX(${layer.flipX ? -1 : 1})`,
                    zIndex: layer.zIndex || index + 1,
                  }}
                >
                  <img
                    src={layer.pieceData?.cutoutImageUrl}
                    alt={layer.pieceData?.title || 'piece'}
                    className="max-w-[200px] sm:max-w-[260px] max-h-[200px] sm:max-h-[260px] object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.45)] pointer-events-none"
                    draggable={false}
                  />

                  {isSelected && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[10px] text-[#E2FF66] font-bold whitespace-nowrap pointer-events-none">
                      {layer.pieceData?.title}
                    </div>
                  )}
                </div>
              );
            })}

          </div>

          {/* Floating Canvas Control Toolbar */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-xl text-xs transition-colors">
            
            <button
              onClick={() => setIsPickerOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#E2FF66] text-[#0D0E12] font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(226,255,102,0.25)] hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Clothing Piece</span>
            </button>

            {selectedLayer && (
              <>
                <div className="h-4 w-px bg-black/10 dark:bg-white/10 mx-1" />

                {/* Scale controls */}
                <button
                  onClick={() => updateSelectedLayer({ scale: Math.max(0.4, (selectedLayer.scale || 1) - 0.1) })}
                  className="p-2 rounded-lg text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A]"
                  title="Scale Down"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => updateSelectedLayer({ scale: Math.min(2.2, (selectedLayer.scale || 1) + 0.1) })}
                  className="p-2 rounded-lg text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A]"
                  title="Scale Up"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                {/* Rotate controls */}
                <button
                  onClick={() => updateSelectedLayer({ rotation: (selectedLayer.rotation || 0) + 15 })}
                  className="p-2 rounded-lg text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A]"
                  title="Rotate Clockwise"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                {/* Flip control */}
                <button
                  onClick={() => updateSelectedLayer({ flipX: !selectedLayer.flipX })}
                  className="p-2 rounded-lg text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A]"
                  title="Flip Horizontal"
                >
                  <FlipHorizontal className="w-4 h-4" />
                </button>

                {/* Z-Index Layer order */}
                <button
                  onClick={bringForward}
                  className="p-2 rounded-lg text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A]"
                  title="Bring Forward"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={sendBackward}
                  className="p-2 rounded-lg text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A]"
                  title="Send Backward"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                {/* Delete Layer */}
                <button
                  onClick={deleteSelectedLayer}
                  className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

          </div>

        </div>

        {/* Sidebar: Layer Inspector & Fashion Tags (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Active Layers List */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-xl transition-colors">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D0E12] dark:text-white mb-3 flex items-center justify-between">
              <span>Canvas Layers ({layers.length})</span>
              <Layers className="w-4 h-4 text-[#7B9600] dark:text-[#E2FF66]" />
            </h4>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
              {layers.length === 0 ? (
                <p className="text-xs text-[#64748B] dark:text-[#8E95A5]">No pieces on canvas.</p>
              ) : (
                layers.map((l, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedLayerIndex(idx)}
                    className={`p-2.5 rounded-2xl flex items-center gap-3 cursor-pointer border transition-all ${
                      selectedLayerIndex === idx
                        ? 'bg-[#E2FF66]/10 border-[#E2FF66] text-[#0D0E12] dark:text-white shadow-sm'
                        : 'bg-[#F4F5F8] dark:bg-[#0D0E12]/60 border-black/5 dark:border-white/5 text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-black/5 dark:bg-black/40 flex items-center justify-center p-1 flex-shrink-0">
                      <img
                        src={l.pieceData?.cutoutImageUrl}
                        alt="thumbnail"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold block truncate text-[#0D0E12] dark:text-white">
                        {l.pieceData?.title}
                      </span>
                      <span className="text-[10px] text-[#7B9600] dark:text-[#E2FF66] truncate block font-medium">
                        @{l.pieceData?.ownerUsername}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Wardrobe Remixing Permissions Info */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-xl transition-colors">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D0E12] dark:text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7B9600] dark:text-[#E2FF66]" />
              Styling & Permissions
            </h4>
            <p className="text-xs text-[#64748B] dark:text-[#8E95A5] leading-relaxed mb-3">
              You can remix your own pieces and clothes from stylists you follow. Follow any creator to instantly unlock their closet.
            </p>
            <button
              onClick={() => {
                setPickerTab('followed');
                setIsPickerOpen(true);
              }}
              className="w-full py-2.5 text-xs font-bold rounded-full bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white hover:border-[#E2FF66] border border-black/10 dark:border-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-3.5 h-3.5 text-[#7B9600] dark:text-[#E2FF66]" />
              <span>Browse Followed Wardrobes</span>
            </button>
          </div>

        </div>

      </div>

      {/* Piece Picker Drawer / Modal */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/15 p-6 shadow-2xl transition-colors">
            
            <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
              <div>
                <h3 className="text-lg font-bold text-[#0D0E12] dark:text-white">Select a Clothing Piece</h3>
                <p className="text-xs text-[#64748B] dark:text-[#8E95A5]">Add cutouts from your own closet or stylists you follow.</p>
              </div>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="p-1.5 rounded-full text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs & Search */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
              
              {/* Tab Switcher */}
              <div className="flex rounded-xl bg-[#F4F5F8] dark:bg-[#0D0E12] p-1 border border-black/10 dark:border-white/10 text-xs">
                <button
                  onClick={() => setPickerTab('followed')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                    pickerTab === 'followed' ? 'bg-[#E2FF66] text-[#0D0E12]' : 'text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Followed Stylists</span>
                </button>
                <button
                  onClick={() => setPickerTab('closet')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                    pickerTab === 'closet' ? 'bg-[#E2FF66] text-[#0D0E12]' : 'text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
                  }`}
                >
                  My Closet
                </button>
                <button
                  onClick={() => setPickerTab('explore')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                    pickerTab === 'explore' ? 'bg-[#E2FF66] text-[#0D0E12]' : 'text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
                  }`}
                >
                  Explore All
                </button>
              </div>

              {/* Category Pills */}
              <div className="flex gap-1.5 overflow-x-auto max-w-full text-[11px]">
                {(['all', 'footwear', 'outerwear', 'tops', 'bottoms', 'bags', 'upcycled'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setPickerCategory(cat)}
                    className={`px-3 py-1 rounded-full capitalize font-medium transition-all ${
                      pickerCategory === cat 
                        ? 'bg-[#0D0E12] dark:bg-white text-white dark:text-[#0D0E12] font-bold' 
                        : 'bg-[#F4F5F8] dark:bg-[#1F222A] text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </div>

            {/* Pieces Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-6">
              {filteredPieces.map(piece => {
                const isMine = piece.ownerUsername.toLowerCase() === currentUser.username.toLowerCase();
                const isFollowed = followedUserIds.includes(piece.ownerUsername.toLowerCase());

                return (
                  <div
                    key={piece.id}
                    className="group p-3 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5 hover:border-[#E2FF66] transition-all flex flex-col justify-between"
                  >
                    <div 
                      onClick={() => addPieceToCanvas(piece)}
                      className="cursor-pointer"
                    >
                      <div className="w-full h-28 rounded-xl bg-black/5 dark:bg-black/40 flex items-center justify-center p-2 overflow-hidden mb-2">
                        <img
                          src={piece.cutoutImageUrl}
                          alt={piece.title}
                          className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <h6 className="text-xs font-bold text-[#0D0E12] dark:text-white truncate">
                        {piece.title}
                      </h6>
                      <p className="text-[10px] text-[#64748B] dark:text-[#8E95A5] truncate">
                        by <span className="text-[#7B9600] dark:text-[#E2FF66]">@{piece.ownerUsername}</span>
                      </p>
                    </div>

                    {!isMine && !isFollowed && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const targetUser = users.find(u => u.username.toLowerCase() === piece.ownerUsername.toLowerCase());
                          if (targetUser) toggleFollowUser(targetUser.id);
                        }}
                        className="mt-2 w-full py-1 text-[10px] font-bold rounded-full bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] flex items-center justify-center gap-1"
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>Follow to Remix</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* Publish Mix Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/15 p-6 shadow-2xl transition-colors">
            
            <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
              <h3 className="text-lg font-bold text-[#0D0E12] dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#7B9600] dark:text-[#E2FF66]" />
                Publish Outfit Mix
              </h3>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="p-1.5 rounded-full text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="mt-4 space-y-4">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#0D0E12] dark:text-white mb-1.5">
                  Mix Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electric Lime Pop x Archival Camel"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F4F5F8] dark:bg-[#0D0E12] text-[#0D0E12] dark:text-white text-xs sm:text-sm border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#E2FF66]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#0D0E12] dark:text-white mb-1.5">
                  Styling Notes / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="What makes this combination work? Share your styling thought process."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F4F5F8] dark:bg-[#0D0E12] text-[#0D0E12] dark:text-white text-xs sm:text-sm border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#E2FF66]"
                />
              </div>

              {/* Technique Tags */}
              <div>
                <label className="block text-xs font-semibold text-[#0D0E12] dark:text-white mb-1.5">
                  Styling Techniques Applied
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {FASHION_TECHNIQUES.map(tech => {
                    const isSelected = selectedTechniques.includes(tech.name);
                    return (
                      <button
                        key={tech.id}
                        type="button"
                        onClick={() => {
                          setSelectedTechniques(prev =>
                            isSelected ? prev.filter(t => t !== tech.name) : [...prev, tech.name]
                          );
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-[#E2FF66] text-[#0D0E12] border-[#E2FF66]'
                            : 'bg-[#F4F5F8] dark:bg-[#1F222A] text-[#64748B] dark:text-[#8E95A5] border-black/5 dark:border-white/5'
                        }`}
                      >
                        {tech.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Why It Works Breakdown */}
              <div>
                <label className="block text-xs font-semibold text-[#0D0E12] dark:text-white mb-1.5">
                  Why This Mix Works (Fashion Literacy Insight)
                </label>
                <input
                  type="text"
                  placeholder="e.g. High-contrast color pop prevents heritage outerwear from looking dated."
                  value={whyItWorks}
                  onChange={(e) => setWhyItWorks(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F4F5F8] dark:bg-[#0D0E12] text-[#0D0E12] dark:text-white text-xs sm:text-sm border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#E2FF66]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-black/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishing || !title.trim()}
                  className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] shadow-[0_0_20px_rgba(226,255,102,0.3)] transition-all"
                >
                  {isPublishing ? 'Publishing...' : 'Publish to Feed'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
