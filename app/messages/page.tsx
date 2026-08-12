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
  ShieldCheck
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
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [selectedAttachmentMixId, setSelectedAttachmentMixId] = useState<string | null>(
    attachedMixParam || null
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeUser = users.find(u => u.id === selectedUserId) || otherUsers[0];

  // Check mutual follow status:
  // Is currentUser following activeUser AND is activeUser following currentUser?
  const isFollowingThem = Boolean(activeUser?.isFollowing);
  // For mock seed data, activeUser is considered following currentUser if followingCount > 0
  const isMutualFollow = isFollowingThem;

  // Filter messages for active conversation
  const conversationMessages = directMessages.filter(
    d => (d.senderId === currentUser.id && d.receiverId === selectedUserId) ||
         (d.senderId === selectedUserId && d.receiverId === currentUser.id)
  );

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages.length, selectedUserId]);

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
    <div className="max-w-6xl mx-auto px-4 py-6 min-h-[calc(100vh-5rem)]">
      
      {/* Container Box */}
      <div className="rounded-3xl bg-white dark:bg-[#16181E] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[700px] transition-colors">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Conversations List (4 Cols)                                   */}
        {/* ========================================================================= */}
        <aside className="md:col-span-4 border-r border-black/5 dark:border-white/5 flex flex-col bg-[#FAFAFC] dark:bg-[#12141A]/50">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-black/5 dark:border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-[#0D0E12] dark:text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#7B9600] dark:text-[#E2FF66]" />
                Direct Messages
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E2FF66]/20 text-[#0D0E12] dark:text-[#E2FF66]">
                Phase 2 Social Hub
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
                    onClick={() => setSelectedUserId(user.id)}
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
        <main className="md:col-span-8 flex flex-col justify-between bg-white dark:bg-[#16181E]">
          
          {/* Active Conversation Top Bar */}
          <div className="p-4 sm:p-5 border-b border-black/5 dark:border-white/5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Link href={`/closet/${activeUser?.username}`} className="relative w-10 h-10 rounded-full overflow-hidden border border-black/10 dark:border-white/15 flex-shrink-0 group">
                <img src={activeUser?.avatarUrl} alt={activeUser?.displayName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </Link>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link href={`/closet/${activeUser?.username}`} className="text-sm font-bold text-[#0D0E12] dark:text-white hover:text-[#7B9600] dark:hover:text-[#E2FF66] transition-colors truncate">
                    {activeUser?.displayName}
                  </Link>
                  <span className="text-xs text-[#7B9600] dark:text-[#E2FF66] font-semibold">@{activeUser?.username}</span>
                </div>

                {/* Mutual Follow Status */}
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Mutual Stylist Connection • Direct Messaging Unlocked</span>
                </div>
              </div>
            </div>

            <Link
              href={`/closet/${activeUser?.username}`}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white border border-black/5 dark:border-white/5 hover:border-[#E2FF66] transition-colors flex items-center gap-1"
            >
              <span>View Closet</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 scrollbar-thin max-h-[500px]">
            {conversationMessages.length === 0 ? (
              <div className="text-center py-16 text-[#64748B] dark:text-[#8E95A5]">
                <div className="w-14 h-14 rounded-full bg-[#E2FF66]/20 text-[#0D0E12] dark:text-[#E2FF66] mx-auto mb-3 flex items-center justify-center">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-[#0D0E12] dark:text-white">Start the styling conversation</h4>
                <p className="text-xs max-w-sm mx-auto mt-1">
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
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-md ${isMe ? 'ml-auto' : 'mr-auto'}`}
                  >
                    {/* Message Bubble */}
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm break-words ${
                        isMe
                          ? 'bg-[#E2FF66] text-[#0D0E12] font-medium rounded-tr-none'
                          : 'bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white rounded-tl-none border border-black/5 dark:border-white/5'
                      }`}
                    >
                      <p>{msg.content}</p>

                      {/* Embedded Mix Card Attachment */}
                      {attachedMix && (
                        <div className="mt-3 p-3 rounded-xl bg-white dark:bg-[#0D0E12] border border-black/10 dark:border-white/15 text-left text-xs shadow-md">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B9600] dark:text-[#E2FF66] flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Lookboard Attachment
                            </span>
                            <span className="text-[9px] text-[#64748B] dark:text-[#8E95A5]">{attachedMix.layers.length} Pieces</span>
                          </div>

                          <h5 className="font-bold text-[#0D0E12] dark:text-white text-xs truncate mb-2">
                            {attachedMix.title}
                          </h5>

                          <div className="w-full h-24 rounded-lg bg-[#0D0E12] overflow-hidden relative flex items-center justify-center p-2 mb-2">
                            <div className="flex -space-x-4">
                              {attachedMix.layers.slice(0, 3).map((l, i) => (
                                <img
                                  key={i}
                                  src={l.pieceData?.cutoutImageUrl}
                                  alt="piece"
                                  className="w-14 h-14 object-contain drop-shadow-md"
                                />
                              ))}
                            </div>
                          </div>

                          <Link
                            href={`/remix?remixMixId=${attachedMix.id}`}
                            className="w-full py-1.5 rounded-lg text-center text-[11px] font-bold bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] transition-all flex items-center justify-center gap-1.5"
                          >
                            <Repeat className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Remix This Look in Studio</span>
                          </Link>
                        </div>
                      )}

                      {/* Embedded Piece Attachment */}
                      {attachedPiece && (
                        <div className="mt-3 p-2.5 rounded-xl bg-white dark:bg-[#0D0E12] border border-black/10 dark:border-white/15 flex items-center gap-3 shadow-md">
                          <div className="w-12 h-12 rounded-lg bg-black/5 dark:bg-black/40 flex items-center justify-center p-1 flex-shrink-0">
                            <img src={attachedPiece.cutoutImageUrl} alt={attachedPiece.title} className="max-h-full max-w-full object-contain" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-[#0D0E12] dark:text-white block truncate">{attachedPiece.title}</span>
                            <span className="text-[10px] text-[#7B9600] dark:text-[#E2FF66]">@{attachedPiece.ownerUsername}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <span className="text-[9px] text-[#94A3B8] dark:text-[#737373] mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Pending Lookboard Attachment Indicator */}
          {selectedAttachmentMixId && (
            <div className="px-4 py-2 bg-[#E2FF66]/10 border-t border-[#E2FF66]/20 flex items-center justify-between text-xs">
              <span className="text-[#0D0E12] dark:text-[#E2FF66] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Attached: &ldquo;{mixes.find(m => m.id === selectedAttachmentMixId)?.title}&rdquo;
              </span>
              <button
                onClick={() => setSelectedAttachmentMixId(null)}
                className="text-xs text-rose-500 hover:underline font-bold"
              >
                Remove
              </button>
            </div>
          )}

          {/* Bottom Chat Input Form */}
          <form onSubmit={handleSend} className="p-4 border-t border-black/5 dark:border-white/5 flex items-center gap-2">
            
            {/* Attach Lookboard Button */}
            <button
              type="button"
              onClick={() => setIsAttachModalOpen(true)}
              className="p-2.5 rounded-full text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-[#1F222A] transition-colors flex-shrink-0"
              title="Attach a styled Lookboard"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder={`Message @${activeUser?.username}...`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 px-4 py-3 rounded-full bg-[#F4F5F8] dark:bg-[#0D0E12] text-[#0D0E12] dark:text-white text-xs sm:text-sm placeholder-[#94A3B8] dark:placeholder-[#737373] border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#E2FF66] transition-all"
            />

            <button
              type="submit"
              disabled={!messageText.trim() && !selectedAttachmentMixId}
              className="p-3 rounded-full bg-[#E2FF66] text-[#0D0E12] hover:bg-[#d5f356] disabled:opacity-40 shadow-sm transition-all flex-shrink-0"
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
