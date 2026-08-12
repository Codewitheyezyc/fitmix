'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { DirectMessage, UserProfile, Mix, Piece } from '@/lib/types';
import { 
  Send, 
  Sparkles, 
  Layers, 
  Repeat, 
  Check, 
  CheckCheck, 
  UserCheck, 
  UserPlus, 
  Search, 
  ArrowLeft, 
  Paperclip,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';

function MessagesContent() {
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get('userId');
  const attachedMixParam = searchParams.get('attachedMixId');

  const { 
    currentUser, 
    users, 
    mixes, 
    pieces, 
    directMessages, 
    sendMessage, 
    toggleFollowUser 
  } = useStore();

  const otherUsers = users.filter(u => u.id !== currentUser.id);

  // Selected Chat User
  const [selectedUserId, setSelectedUserId] = useState<string>(
    targetUserId || otherUsers[0]?.id || 'usr_1'
  );
  const [mobileView, setMobileView] = useState<'list' | 'chat'>(targetUserId ? 'chat' : 'list');
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [selectedAttachmentMixId, setSelectedAttachmentMixId] = useState<string | null>(
    attachedMixParam || null
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeUser = users.find(u => u.id === selectedUserId) || otherUsers[0];

  // Mutual follow status
  const isFollowingThem = Boolean(activeUser?.isFollowing);
  const isMutualFollow = isFollowingThem;

  // Filter messages for active conversation
  const conversationMessages = directMessages.filter(
    d => (d.senderId === currentUser.id && d.receiverId === selectedUserId) ||
         (d.senderId === selectedUserId && d.receiverId === currentUser.id)
  );

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages.length, selectedUserId, mobileView]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() && !selectedAttachmentMixId) return;

    sendMessage(
      selectedUserId,
      messageText.trim() || 'Shared a styled outfit lookboard:',
      selectedAttachmentMixId || undefined
    );

    setMessageText('');
    setSelectedAttachmentMixId(null);
  };

  const myMixes = mixes.filter(m => m.creatorId === currentUser.id || m.creatorUsername === currentUser.username);

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 min-h-[calc(100vh-5rem)]">
      
      {/* Container Box */}
      <div className="rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px] max-h-[82vh] transition-colors">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Conversations List (4 Cols)                                   */}
        {/* ========================================================================= */}
        <aside className={`md:col-span-4 border-r border-black/5 dark:border-white/5 flex flex-col bg-[#FAFAFC] dark:bg-[#12141A]/50 h-full ${
          mobileView === 'chat' ? 'hidden md:flex' : 'flex'
        }`}>
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-black/5 dark:border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-[#0D0E12] dark:text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#7B9600] dark:text-[#E2FF66]" />
                <span>Messages</span>
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E2FF66]/20 text-[#0D0E12] dark:text-[#E2FF66]">
                Direct Chat
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] dark:text-[#737373]" />
              <input
                type="text"
                placeholder="Search stylists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-[#1E2028] text-xs text-[#0D0E12] dark:text-white placeholder-[#94A3B8] dark:placeholder-[#737373] border border-black/5 dark:border-white/5 focus:outline-none focus:border-[#E2FF66]"
              />
            </div>
          </div>

          {/* Stylists List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
            {otherUsers
              .filter(u => u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || u.username.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(user => {
                const isSelected = user.id === selectedUserId;
                const userDms = directMessages.filter(
                  d => (d.senderId === currentUser.id && d.receiverId === user.id) ||
                       (d.senderId === user.id && d.receiverId === currentUser.id)
                );
                const lastMsg = userDms[userDms.length - 1];

                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      setSelectedUserId(user.id);
                      setMobileView('chat');
                    }}
                    className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-white dark:bg-[#1E2028] shadow-md border border-black/5 dark:border-white/10'
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="relative w-11 h-11 rounded-full overflow-hidden border border-black/10 dark:border-white/15 flex-shrink-0">
                      <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
                      {user.isFollowing && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#16181E]" title="Mutual Stylist" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="text-xs font-bold text-[#0D0E12] dark:text-white truncate">
                          {user.displayName}
                        </h4>
                        {lastMsg && (
                          <span className="text-[9px] text-[#94A3B8] dark:text-[#737373]">
                            {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#64748B] dark:text-[#8E95A5] truncate">
                        {lastMsg ? lastMsg.content : `@${user.username}`}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>

        </aside>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Active Chat Thread Viewport (8 Cols)                        */}
        {/* ========================================================================= */}
        <main className={`md:col-span-8 flex flex-col justify-between bg-white dark:bg-[#16181E] h-full ${
          mobileView === 'list' ? 'hidden md:flex' : 'flex'
        }`}>
          
          {/* Active Conversation Top Bar */}
          <div className="p-3.5 sm:p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between gap-2 flex-shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              
              {/* Back to list button on Mobile */}
              <button 
                onClick={() => setMobileView('list')}
                className="md:hidden p-1.5 rounded-xl text-[#0D0E12] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex-shrink-0"
                title="Back to conversations"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <Link href={`/closet/${activeUser?.username}`} className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-black/10 dark:border-white/15 flex-shrink-0 group">
                <img src={activeUser?.avatarUrl} alt={activeUser?.displayName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </Link>
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Link href={`/closet/${activeUser?.username}`} className="text-xs sm:text-sm font-bold text-[#0D0E12] dark:text-white hover:text-[#7B9600] dark:hover:text-[#E2FF66] transition-colors truncate">
                    {activeUser?.displayName}
                  </Link>
                  <span className="text-[11px] text-[#7B9600] dark:text-[#E2FF66] font-semibold truncate hidden sm:inline">@{activeUser?.username}</span>
                </div>

                {/* Mutual Follow Status */}
                <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate">
                  <ShieldCheck className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">Mutual Connection</span>
                </div>
              </div>
            </div>

            {/* Sleek Compact View Closet Button */}
            <Link
              href={`/closet/${activeUser?.username}`}
              className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] font-semibold bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white border border-black/5 dark:border-white/5 hover:border-[#E2FF66] transition-colors flex items-center gap-1 flex-shrink-0"
            >
              <span>Closet</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-3.5 sm:p-5 overflow-y-auto space-y-3.5 scrollbar-thin">
            {conversationMessages.length === 0 ? (
              <div className="text-center py-12 sm:py-16 text-[#64748B] dark:text-[#8E95A5]">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E2FF66]/20 text-[#0D0E12] dark:text-[#E2FF66] mx-auto mb-3 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0D0E12] dark:text-white">Start the styling conversation</h4>
                <p className="text-[11px] sm:text-xs max-w-sm mx-auto mt-1 px-4">
                  Ask @{activeUser?.username} about pieces in their closet or share a remix lookboard directly into this thread.
                </p>
              </div>
            ) : (
              conversationMessages.map(msg => {
                const isMe = msg.senderId === currentUser.id;
                const attachedMix = msg.attachedMixId ? mixes.find(m => m.id === msg.attachedMixId) : null;
                const attachedPiece = msg.attachedPieceId ? pieces.find(p => p.id === msg.attachedPieceId) : null;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-md ${isMe ? 'ml-auto' : 'mr-auto'}`}
                  >
                    {/* Message Bubble */}
                    <div
                      className={`p-3 sm:p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm break-words ${
                        isMe
                          ? 'bg-[#E2FF66] text-[#0D0E12] font-medium rounded-tr-none'
                          : 'bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white rounded-tl-none border border-black/5 dark:border-white/5'
                      }`}
                    >
                      <p>{msg.content}</p>

                      {/* Embedded Mix Card Attachment */}
                      {attachedMix && (
                        <div className="mt-2.5 p-2.5 rounded-xl bg-white dark:bg-[#0D0E12] border border-black/10 dark:border-white/15 text-left text-xs shadow-md">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#7B9600] dark:text-[#E2FF66] flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Attached Lookboard
                            </span>
                            <span className="text-[9px] text-[#94A3B8]">{attachedMix.layers.length} items</span>
                          </div>

                          {/* Flat-Lay Preview Canvas */}
                          <div className="w-full aspect-[4/3] rounded-lg overflow-hidden canvas-bg-obsidian relative mb-2 flex items-center justify-center">
                            {attachedMix.layers.map((layer, idx) => (
                              layer.pieceData && (
                                <img
                                  key={idx}
                                  src={layer.pieceData.cutoutImageUrl}
                                  alt={layer.pieceData.title}
                                  className="absolute max-w-[45px] max-h-[45px] object-contain drop-shadow"
                                  style={{
                                    left: `${layer.x}%`,
                                    top: `${layer.y}%`,
                                    transform: `translate(-50%, -50%) scale(${layer.scale * 0.55}) rotate(${layer.rotation}deg)`,
                                    zIndex: layer.zIndex
                                  }}
                                />
                              )
                            ))}
                          </div>

                          <h5 className="font-bold text-xs text-[#0D0E12] dark:text-white truncate">{attachedMix.title}</h5>
                          
                          {/* 1-Tap Remix in Studio CTA */}
                          <Link
                            href={`/remix?remixMixId=${attachedMix.id}`}
                            className="mt-2 w-full py-1.5 rounded-lg bg-[#E2FF66] text-[#0D0E12] font-bold text-[10px] flex items-center justify-center gap-1 hover:bg-[#d5f356] transition-colors"
                          >
                            <Repeat className="w-3 h-3 stroke-[2.5]" />
                            <span>Remix in Studio</span>
                          </Link>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mt-1 text-[9px] text-[#94A3B8] px-1">
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Attached Mix Chip Banner */}
          {selectedAttachmentMixId && (
            <div className="px-4 py-2 bg-[#E2FF66]/10 border-t border-[#E2FF66]/30 flex items-center justify-between text-xs text-[#0D0E12] dark:text-white flex-shrink-0">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#7B9600] dark:text-[#E2FF66]">
                <Layers className="w-3.5 h-3.5" />
                Attached: {mixes.find(m => m.id === selectedAttachmentMixId)?.title}
              </span>
              <button
                onClick={() => setSelectedAttachmentMixId(null)}
                className="text-[10px] font-bold text-rose-500 hover:underline"
              >
                Remove
              </button>
            </div>
          )}

          {/* Message Input Bar */}
          <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-black/5 dark:border-white/5 bg-white dark:bg-[#16181E] flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsAttachModalOpen(true)}
              className="p-2 sm:p-2.5 rounded-full bg-[#F4F5F8] dark:bg-[#1F222A] text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/10 dark:hover:bg-[#282C37] transition-colors"
              title="Attach Outfit Lookboard"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={`Message @${activeUser?.username}...`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 px-4 py-2 sm:py-2.5 rounded-full bg-[#F4F5F8] dark:bg-[#1F222A] text-xs text-[#0D0E12] dark:text-white placeholder-[#94A3B8] dark:placeholder-[#737373] border border-black/5 dark:border-white/5 focus:outline-none focus:border-[#E2FF66] transition-colors"
            />

            <button
              type="submit"
              disabled={!messageText.trim() && !selectedAttachmentMixId}
              className="p-2 sm:p-2.5 rounded-full bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] disabled:opacity-40 shadow-sm transition-transform active:scale-95 flex-shrink-0"
              title="Send Message"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

        </main>

      </div>

      {/* Attach Mix Modal */}
      {isAttachModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/15 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
              <h3 className="text-sm font-bold text-[#0D0E12] dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#7B9600] dark:text-[#E2FF66]" />
                Select a Mix to Attach
              </h3>
              <button
                onClick={() => setIsAttachModalOpen(false)}
                className="text-xs text-[#64748B] hover:text-black dark:hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="py-4 space-y-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
              {mixes.map(mix => (
                <div
                  key={mix.id}
                  onClick={() => {
                    setSelectedAttachmentMixId(mix.id);
                    setIsAttachModalOpen(false);
                  }}
                  className="p-3 rounded-2xl bg-[#F4F5F8] dark:bg-[#1F222A] border border-black/5 dark:border-white/5 hover:border-[#E2FF66] cursor-pointer transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-[#0D0E12] dark:text-white group-hover:text-[#7B9600] dark:group-hover:text-[#E2FF66] truncate">
                      {mix.title}
                    </h5>
                    <p className="text-[10px] text-[#64748B] dark:text-[#8E95A5] truncate">
                      by @{mix.creatorUsername} • {mix.layers.length} pieces
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-[#7B9600] dark:text-[#E2FF66]">Attach</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs text-[#64748B]">Loading conversations...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
