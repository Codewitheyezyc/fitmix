'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Piece, MixLayer, CanvasBackground, Mix } from '@/lib/types';
import { FASHION_TECHNIQUES } from '@/lib/seedData';
import AuthModal from '@/components/auth/AuthModal';
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
  Users,
  Wand2,
  Tag,
  Flame,
  ChevronRight,
  Repeat
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
    isAuthenticated,
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
  const [swapTargetLayerIndex, setSwapTargetLayerIndex] = useState<number | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [pickerTab, setPickerTab] = useState<'followed' | 'closet' | 'explore'>(
    isAuthenticated ? 'followed' : 'explore'
  );
  const [pickerCategory, setPickerCategory] = useState<string>('all');

  // Guest Conversion / Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<{
    title?: string;
    subtitle?: string;
    onSuccess?: () => void;
  }>({});

  // Custom styling techniques state
  const [customTechniqueList, setCustomTechniqueList] = useState<string[]>([]);
  const [isAddingCustomTech, setIsAddingCustomTech] = useState(false);
  const [customTechInput, setCustomTechInput] = useState('');

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

  // Smart Auto-Fit & Multi-Outfit Alignment Engine
  const autoFitAndArrangeLayers = () => {
    if (layers.length === 0) return;

    const count = layers.length;
    const baseScale = count <= 2 ? 0.95 : count === 3 ? 0.85 : count === 4 ? 0.78 : 0.68;

    const catCounts: Record<string, number> = {};

    const updatedLayers = layers.map((layer, idx) => {
      const cat = layer.pieceData?.category || 'tops';
      catCounts[cat] = (catCounts[cat] || 0) + 1;
      const catIdx = catCounts[cat];

      let targetX = 50;
      let targetY = 50;
      let targetScale = baseScale;
      let targetZIndex = idx + 1;
      let targetRotation = 0;

      switch (cat) {
        case 'outerwear':
          targetX = catIdx > 1 ? 55 : 50;
          targetY = 28;
          targetScale = baseScale * 1.05;
          targetZIndex = 1;
          targetRotation = -2;
          break;
        case 'tops':
          targetX = catIdx > 1 ? (catIdx === 2 ? 65 : 35) : 50;
          targetY = 38 + (catIdx > 1 ? 6 : 0);
          targetScale = baseScale * 0.95;
          targetZIndex = 2;
          targetRotation = 1;
          break;
        case 'bottoms':
          targetX = catIdx > 1 ? (catIdx === 2 ? 65 : 35) : 50;
          targetY = 66;
          targetScale = baseScale * 1.0;
          targetZIndex = 3;
          targetRotation = 0;
          break;
        case 'footwear':
          targetX = catIdx > 1 ? (catIdx === 2 ? 35 : 68) : (layers.some(l => l.pieceData?.category === 'bags') ? 70 : 50);
          targetY = 86;
          targetScale = baseScale * 0.82;
          targetZIndex = 4;
          targetRotation = 4;
          break;
        case 'bags':
          targetX = catIdx > 1 ? 75 : 24;
          targetY = 48;
          targetScale = baseScale * 0.75;
          targetZIndex = 5;
          targetRotation = -8;
          break;
        case 'accessories':
          targetX = catIdx > 1 ? 25 : 75;
          targetY = 22;
          targetScale = baseScale * 0.65;
          targetZIndex = 6;
          targetRotation = 6;
          break;
        case 'upcycled':
          targetX = 50;
          targetY = 36;
          targetScale = baseScale * 1.0;
          targetZIndex = 2;
          break;
        default:
          targetX = 50;
          targetY = 50;
          targetScale = baseScale;
          break;
      }

      return {
        ...layer,
        x: targetX,
        y: targetY,
        scale: targetScale,
        rotation: targetRotation,
        zIndex: targetZIndex
      };
    });

    setLayers(updatedLayers);
  };

  // Add or Swap Piece on Canvas
  const addPieceToCanvas = (piece: Piece) => {
    // If in Swap Mode, replace target layer's garment while maintaining position and scale
    if (swapTargetLayerIndex !== null && layers[swapTargetLayerIndex]) {
      setLayers(prev => {
        const copy = [...prev];
        copy[swapTargetLayerIndex] = {
          ...copy[swapTargetLayerIndex],
          pieceId: piece.id,
          pieceData: piece
        };
        return copy;
      });
      setSelectedLayerIndex(swapTargetLayerIndex);
      setSwapTargetLayerIndex(null);
      setIsPickerOpen(false);
      return;
    }

    const cat = piece.category;
    const count = layers.length + 1;
    const baseScale = count <= 2 ? 0.95 : count === 3 ? 0.85 : count === 4 ? 0.78 : 0.68;

    let initialY = 50;
    let initialX = 50;
    if (cat === 'outerwear') initialY = 28;
    else if (cat === 'tops') initialY = 38;
    else if (cat === 'bottoms') initialY = 66;
    else if (cat === 'footwear') { initialY = 86; initialX = 68; }
    else if (cat === 'bags') { initialY = 48; initialX = 24; }
    else if (cat === 'accessories') { initialY = 22; initialX = 75; }

    const newLayer: MixLayer = {
      pieceId: piece.id,
      x: initialX,
      y: initialY,
      scale: baseScale,
      rotation: Math.floor(Math.random() * 6 - 3),
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

  // Add Custom Technique Handler
  const handleAddCustomTechnique = () => {
    const trimmed = customTechInput.trim();
    if (!trimmed) return;
    if (!customTechniqueList.includes(trimmed)) {
      setCustomTechniqueList(prev => [...prev, trimmed]);
    }
    if (!selectedTechniques.includes(trimmed)) {
      setSelectedTechniques(prev => [...prev, trimmed]);
    }
    setCustomTechInput('');
    setIsAddingCustomTech(false);
  };

  // Follow to Unlock Gate for Guests
  const handleFollowToUnlock = (piece: Piece) => {
    const targetUser = users.find(u => u.username.toLowerCase() === piece.ownerUsername.toLowerCase());
    if (!isAuthenticated) {
      setAuthModalConfig({
        title: `✨ Unlock @${piece.ownerUsername}'s Wardrobe`,
        subtitle: `Create your free stylist profile in 5 seconds to remix @${piece.ownerUsername}'s clothes, unlock community pieces, and build your digital closet.`,
        onSuccess: () => {
          if (targetUser) toggleFollowUser(targetUser.id);
          addPieceToCanvas(piece);
        }
      });
      setIsAuthModalOpen(true);
      return;
    }
    if (targetUser) toggleFollowUser(targetUser.id);
  };

  // Initiate Publish with Guest Check
  const handleInitiatePublish = () => {
    if (layers.length === 0) return;

    if (!isAuthenticated) {
      setAuthModalConfig({
        title: '🔥 Claim Your Stylist Handle & Publish',
        subtitle: 'Create a free account in 5 seconds to publish this lookboard, notify the original piece owners, and show up on the community feed!',
        onSuccess: () => {
          setIsPublishModalOpen(true);
        }
      });
      setIsAuthModalOpen(true);
      return;
    }

    setIsPublishModalOpen(true);
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

  // Followed User IDs list for filtering
  const followedUserIds = users.filter(u => u.isFollowing).map(u => u.username.toLowerCase());

  // Filtered pieces for the picker drawer
  const filteredPieces = pieces.filter(p => {
    const matchesCategory = pickerCategory === 'all' || p.category === pickerCategory;
    if (!matchesCategory) return false;

    if (pickerTab === 'closet') {
      return p.ownerUsername.toLowerCase() === currentUser.username.toLowerCase();
    }
    if (pickerTab === 'followed') {
      return followedUserIds.includes(p.ownerUsername.toLowerCase()) || p.ownerUsername.toLowerCase() === currentUser.username.toLowerCase();
    }
    return true; // explore all
  });

  // Combine default techniques + user-created custom techniques
  const allAvailableTechniques = [
    ...FASHION_TECHNIQUES.map(t => t.name),
    ...customTechniqueList.filter(ct => !FASHION_TECHNIQUES.some(t => t.name === ct))
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Guest Welcome Sandbox Banner (For Unregistered Visitors) */}
      {!isAuthenticated && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#E2FF66]/20 via-[#E2FF66]/10 to-transparent border border-[#E2FF66]/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E2FF66] text-[#0D0E12] flex items-center justify-center flex-shrink-0 font-black text-xs shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0D0E12] dark:text-white">
                Guest Styling Sandbox • Try Fitmix Studio
              </h4>
              <p className="text-[11px] text-[#64748B] dark:text-[#8E95A5]">
                Drag, rotate, and auto-fit clothes into outfit collages. Create a free profile to unlock 500+ pieces and publish!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setAuthModalConfig({
                title: '✨ Join the Collaborative Fashion Network',
                subtitle: 'Sign up in 5 seconds to unlock every creator closet, publish your lookboards, and build your digital wardrobe.'
              });
              setIsAuthModalOpen(true);
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] transition-all hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-1.5 flex-shrink-0"
          >
            <span>Sign Up Free</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      )}

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

          {/* Smart Auto-Fit & Arrange Button */}
          {layers.length >= 2 && (
            <button
              onClick={autoFitAndArrangeLayers}
              className="px-3.5 py-2 rounded-full text-xs font-semibold bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white border border-black/10 dark:border-white/10 hover:border-[#E2FF66] hover:text-[#7B9600] dark:hover:text-[#E2FF66] transition-all flex items-center gap-1.5 shadow-sm"
              title="Automatically arrange and scale all pieces to fit the canvas"
            >
              <Wand2 className="w-3.5 h-3.5 text-[#7B9600] dark:text-[#E2FF66]" />
              <span className="hidden sm:inline">Auto-Fit Look</span>
            </button>
          )}

          {/* Publish CTA Button */}
          <button
            onClick={handleInitiatePublish}
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

          {/* Floating Canvas Control Toolbar - 2-Tier Structured Layout */}
          <div className="mt-4 w-full max-w-xl flex flex-col items-center gap-2">
            
            {/* Tier 1: Primary Action Buttons */}
            <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-xl text-xs transition-colors">
              <button
                onClick={() => setIsPickerOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#E2FF66] text-[#0D0E12] font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(226,255,102,0.25)] hover:scale-105 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Clothing Piece</span>
              </button>

              {layers.length >= 2 && (
                <button
                  onClick={autoFitAndArrangeLayers}
                  className="px-3.5 py-2 rounded-xl bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white hover:text-[#7B9600] dark:hover:text-[#E2FF66] border border-black/5 dark:border-white/5 font-semibold flex items-center gap-1.5 transition-colors"
                  title="Auto-Fit and arrange all pieces on the canvas"
                >
                  <Wand2 className="w-4 h-4 text-[#7B9600] dark:text-[#E2FF66]" />
                  <span>Auto-Fit</span>
                </button>
              )}
            </div>

            {/* Tier 2: Selected Layer Controls (Always Grouped Together) */}
            {selectedLayer && (
              <div className="flex items-center justify-center gap-1 p-1.5 rounded-2xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-xl text-xs overflow-x-auto no-scrollbar max-w-full animate-in fade-in duration-200">
                <span className="text-[10px] font-bold text-[#64748B] dark:text-[#8E95A5] px-2 truncate max-w-[80px] sm:max-w-[100px] border-r border-black/10 dark:border-white/10">
                  {selectedLayer.pieceData?.title}
                </span>

                {/* Swap Piece Action */}
                <button
                  onClick={() => {
                    setSwapTargetLayerIndex(selectedLayerIndex);
                    setIsPickerOpen(true);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-[#E2FF66]/20 text-[#7B9600] dark:text-[#E2FF66] hover:bg-[#E2FF66] hover:text-[#0D0E12] font-bold text-xs flex items-center gap-1 transition-all flex-shrink-0"
                  title="Swap this garment with another piece"
                >
                  <Repeat className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Swap Piece</span>
                </button>

                {/* Scale Down (Zoom -) */}
                <button
                  onClick={() => updateSelectedLayer({ scale: Math.max(0.4, (selectedLayer.scale || 1) - 0.1) })}
                  className="p-2 rounded-xl text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A] transition-colors"
                  title="Scale Down (Zoom -)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                {/* Scale Up (Zoom +) */}
                <button
                  onClick={() => updateSelectedLayer({ scale: Math.min(2.2, (selectedLayer.scale || 1) + 0.1) })}
                  className="p-2 rounded-xl text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A] transition-colors"
                  title="Scale Up (Zoom +)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                {/* Rotate */}
                <button
                  onClick={() => updateSelectedLayer({ rotation: (selectedLayer.rotation || 0) + 15 })}
                  className="p-2 rounded-xl text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A] transition-colors"
                  title="Rotate Clockwise"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                {/* Flip Horizontal */}
                <button
                  onClick={() => updateSelectedLayer({ flipX: !selectedLayer.flipX })}
                  className="p-2 rounded-xl text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A] transition-colors"
                  title="Flip Horizontal"
                >
                  <FlipHorizontal className="w-4 h-4" />
                </button>

                {/* Bring Forward */}
                <button
                  onClick={bringForward}
                  className="p-2 rounded-xl text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A] transition-colors"
                  title="Bring Forward"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                {/* Send Backward */}
                <button
                  onClick={sendBackward}
                  className="p-2 rounded-xl text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A] transition-colors"
                  title="Send Backward"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                {/* Delete Layer */}
                <button
                  onClick={deleteSelectedLayer}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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
                <p className="text-xs text-[#64748B] dark:text-[#8E95A5] italic py-2">No clothing pieces added yet.</p>
              ) : (
                layers.map((l, idx) => (
                  <div
                    key={`${l.pieceId}_list_${idx}`}
                    onClick={() => setSelectedLayerIndex(idx)}
                    className={`p-2.5 rounded-2xl cursor-pointer border transition-all flex items-center gap-3 ${
                      selectedLayerIndex === idx
                        ? 'bg-[#E2FF66]/10 border-[#E2FF66]'
                        : 'bg-[#F4F5F8] dark:bg-[#1F222A] border-black/5 dark:border-white/5 hover:border-black/20'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-black/40 flex items-center justify-center p-1 flex-shrink-0">
                      <img src={l.pieceData?.cutoutImageUrl} alt="" className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h6 className="text-xs font-bold text-[#0D0E12] dark:text-white truncate">
                        {l.pieceData?.title}
                      </h6>
                      <span className="text-[10px] text-[#7B9600] dark:text-[#E2FF66] truncate block font-medium">
                        @{l.pieceData?.ownerUsername}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSwapTargetLayerIndex(idx);
                        setIsPickerOpen(true);
                      }}
                      className="p-1.5 px-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#E2FF66] hover:text-[#0D0E12] text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0"
                      title="Swap this piece"
                    >
                      <Repeat className="w-3 h-3" />
                      <span className="text-[10px]">Swap</span>
                    </button>
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          
          <div className="fixed inset-0" onClick={() => { setIsPickerOpen(false); setSwapTargetLayerIndex(null); }} />

          <div className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[85vh] rounded-t-[32px] sm:rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/15 shadow-2xl flex flex-col z-10 transition-colors overflow-hidden">
            
            {/* Mobile Pull Drag Indicator */}
            <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mx-auto mt-3 mb-1 sm:hidden flex-shrink-0" />

            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#0D0E12] dark:text-white flex items-center gap-2">
                  {swapTargetLayerIndex !== null ? (
                    <>
                      <Repeat className="w-5 h-5 text-[#7B9600] dark:text-[#E2FF66]" />
                      <span>Swap Piece in Layer #{swapTargetLayerIndex + 1}</span>
                    </>
                  ) : (
                    <span>Select a Clothing Piece</span>
                  )}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#64748B] dark:text-[#8E95A5]">
                  {swapTargetLayerIndex !== null ? (
                    <span>Choose any piece to replace <strong>&ldquo;{layers[swapTargetLayerIndex]?.pieceData?.title}&rdquo;</strong> while keeping canvas coordinates.</span>
                  ) : (
                    isAuthenticated ? 'Add cutouts from your own closet or stylists you follow.' : 'Explore & remix community clothing pieces freely.'
                  )}
                </p>
              </div>
              <button
                onClick={() => { setIsPickerOpen(false); setSwapTargetLayerIndex(null); }}
                className="p-2 rounded-full text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs & Categories */}
            <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-black/5 dark:border-white/5 space-y-3 flex-shrink-0">
              
              {/* Tab Switcher - Balanced Grid */}
              <div className="grid grid-cols-3 rounded-2xl bg-[#F4F5F8] dark:bg-[#12141A] p-1 border border-black/5 dark:border-white/5 text-xs">
                <button
                  onClick={() => setPickerTab('followed')}
                  className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 text-center truncate ${
                    pickerTab === 'followed' 
                      ? 'bg-[#E2FF66] text-[#0D0E12] shadow-sm' 
                      : 'text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">Followed</span>
                </button>
                <button
                  onClick={() => setPickerTab('closet')}
                  className={`px-3 py-2 rounded-xl font-bold transition-all text-center truncate ${
                    pickerTab === 'closet' 
                      ? 'bg-[#E2FF66] text-[#0D0E12] shadow-sm' 
                      : 'text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
                  }`}
                >
                  My Closet
                </button>
                <button
                  onClick={() => setPickerTab('explore')}
                  className={`px-3 py-2 rounded-xl font-bold transition-all text-center truncate ${
                    pickerTab === 'explore' 
                      ? 'bg-[#E2FF66] text-[#0D0E12] shadow-sm' 
                      : 'text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
                  }`}
                >
                  Explore All
                </button>
              </div>

              {/* Category Pills with no-scrollbar */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
                {(['all', 'footwear', 'outerwear', 'tops', 'bottoms', 'bags', 'accessories', 'upcycled'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setPickerCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full capitalize font-semibold transition-all flex-shrink-0 ${
                      pickerCategory === cat 
                        ? 'bg-[#0D0E12] dark:bg-white text-white dark:text-[#0D0E12] shadow-sm' 
                        : 'bg-[#F4F5F8] dark:bg-[#1F222A] text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white border border-black/5 dark:border-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

            </div>

            {/* Pieces Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
              {filteredPieces.length === 0 ? (
                <div className="text-center py-12 text-xs text-[#64748B] dark:text-[#8E95A5]">
                  No pieces found in this category.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
                              className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
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
                              handleFollowToUnlock(piece);
                            }}
                            className="mt-2 w-full py-1.5 rounded-xl text-[10px] font-bold bg-[#0D0E12] dark:bg-white text-white dark:text-[#0D0E12] hover:bg-[#E2FF66] dark:hover:bg-[#E2FF66] hover:text-[#0D0E12] dark:hover:text-[#0D0E12] shadow-sm flex items-center justify-center gap-1 transition-all active:scale-95"
                          >
                            <UserPlus className="w-3 h-3 text-[#E2FF66] dark:text-[#7B9600]" />
                            <span>Follow to Unlock</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Publish Mix Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          
          <div className="fixed inset-0" onClick={() => setIsPublishModalOpen(false)} />

          <div className="relative w-full max-w-xl max-h-[92vh] sm:max-h-[85vh] rounded-t-[32px] sm:rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/15 shadow-2xl flex flex-col z-10 transition-colors overflow-hidden">
            
            {/* Mobile Pull Drag Indicator */}
            <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mx-auto mt-3 mb-1 sm:hidden flex-shrink-0" />

            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between flex-shrink-0">
              <h3 className="text-base sm:text-lg font-bold text-[#0D0E12] dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#7B9600] dark:text-[#E2FF66]" />
                <span>Publish Outfit Mix</span>
              </h3>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="p-2 rounded-full text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handlePublish} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#0D0E12] dark:text-white mb-1">
                  Mix Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electric Lime Pop x Archival Camel"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white text-xs sm:text-sm border border-black/5 dark:border-white/5 focus:outline-none focus:border-[#E2FF66] transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#0D0E12] dark:text-white mb-1">
                  Styling Notes / Description (mention creators with @)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Layered with @elena_v's trench for contrast styling..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white text-xs sm:text-sm border border-black/5 dark:border-white/5 focus:outline-none focus:border-[#E2FF66] transition-colors"
                />
                {/* Mention Stylist Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 text-[11px]">
                  <span className="text-[#64748B] dark:text-[#8E95A5] text-[10px] font-semibold flex-shrink-0">
                    Mention:
                  </span>
                  {users.filter(u => u.id !== currentUser.id).slice(0, 5).map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setDescription(prev => prev ? `${prev} @${u.username} ` : `@${u.username} `)}
                      className="px-2 py-0.5 rounded-full bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white border border-black/5 dark:border-white/5 hover:border-[#E2FF66] text-[10px] font-medium flex-shrink-0"
                    >
                      @{u.username}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technique Tags with Custom Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#0D0E12] dark:text-white">
                    Styling Techniques Applied
                  </label>
                  <span className="text-[10px] text-[#64748B] dark:text-[#8E95A5]">Select or invent custom tags</span>
                </div>

                <div className="flex flex-wrap gap-1.5 items-center">
                  {allAvailableTechniques.map(techName => {
                    const isSelected = selectedTechniques.includes(techName);
                    return (
                      <button
                        key={techName}
                        type="button"
                        onClick={() => {
                          setSelectedTechniques(prev =>
                            isSelected ? prev.filter(t => t !== techName) : [...prev, techName]
                          );
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-[#E2FF66] text-[#0D0E12] border-[#E2FF66] shadow-sm'
                            : 'bg-[#F4F5F8] dark:bg-[#1F222A] text-[#64748B] dark:text-[#8E95A5] border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20'
                        }`}
                      >
                        {techName}
                      </button>
                    );
                  })}

                  {/* Custom Technique Creator Input */}
                  {isAddingCustomTech ? (
                    <div className="inline-flex items-center gap-1 bg-[#F4F5F8] dark:bg-[#1F222A] p-0.5 pl-2.5 rounded-full border border-[#E2FF66] animate-in fade-in">
                      <input
                        type="text"
                        placeholder="e.g. 90s Minimalist"
                        value={customTechInput}
                        onChange={(e) => setCustomTechInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomTechnique();
                          }
                        }}
                        className="bg-transparent text-xs text-[#0D0E12] dark:text-white placeholder-[#94A3B8] focus:outline-none w-28"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomTechnique}
                        className="p-1 rounded-full bg-[#E2FF66] text-[#0D0E12] hover:scale-105 transition-transform"
                        title="Add custom technique"
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingCustomTech(false);
                          setCustomTechInput('');
                        }}
                        className="p-1 rounded-full text-[#64748B] hover:text-black dark:hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddingCustomTech(true)}
                      className="px-3 py-1 rounded-full text-xs font-semibold border border-dashed border-black/20 dark:border-white/20 text-[#7B9600] dark:text-[#E2FF66] hover:border-[#E2FF66] transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 stroke-[3]" />
                      <span>Custom Technique</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Why It Works Breakdown */}
              <div>
                <label className="block text-xs font-semibold text-[#0D0E12] dark:text-white mb-1">
                  Why This Mix Works (Fashion Literacy Insight)
                </label>
                <input
                  type="text"
                  placeholder="e.g. High-contrast color pop prevents heritage outerwear from looking dated."
                  value={whyItWorks}
                  onChange={(e) => setWhyItWorks(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white text-xs sm:text-sm border border-black/5 dark:border-white/5 focus:outline-none focus:border-[#E2FF66] transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-black/5 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishing || !title.trim()}
                  className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] shadow-[0_0_20px_rgba(226,255,102,0.3)] transition-all hover:scale-102 active:scale-95 disabled:opacity-40"
                >
                  {isPublishing ? 'Publishing...' : 'Publish to Feed'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Guest Sign Up / Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="signup"
        customTitle={authModalConfig.title}
        customSubtitle={authModalConfig.subtitle}
        onSuccess={authModalConfig.onSuccess}
      />

    </div>
  );
}
