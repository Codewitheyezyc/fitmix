'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useRealtimeChat } from '@/lib/useRealtimeChat';
import { UserProfile, Mix } from '@/lib/types';
import { X, Send, MessageCircle, Sparkles, User, Shirt, Layers, Repeat, Maximize2 } from 'lucide-react';

interface DirectMessageDrawerProps {
  onClose: () => void;
  targetUser?: UserProfile;
}

export default function DirectMessageDrawer({ onClose, targetUser }: DirectMessageDrawerProps) {
  const { users, currentUser, mixes, sendMessage, getMessagesBetween } = useStore();
  
  const otherUsers = users.filter(u => u.id !== currentUser.id);
  const [activeUser, setActiveUser] = useState<UserProfile>(targetUser || otherUsers[0]);
  const [messageText, setMessageText] = useState('');

  // Real-time Chat Hook
  const { isTargetUserTyping, sendTypingStatus } = useRealtimeChat(activeUser?.id);

  const messages = activeUser ? getMessagesBetween(currentUser.id, activeUser.id) : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeUser) return;

    sendMessage(activeUser.id, messageText.trim());
    sendTypingStatus(activeUser.id, false);
    setMessageText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-white dark:bg-[#16181E] border-l border-black/10 dark:border-white/10 shadow-2xl flex flex-col transition-colors">
        
        {/* Header */}
        <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#7B9600] dark:text-[#E2FF66]" />
            <h3 className="font-bold text-sm text-[#0D0E12] dark:text-white">Quick Chat</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E2FF66]/20 text-[#0D0E12] dark:text-[#E2FF66]">Live</span>
          </div>
          <div className="flex items-center gap-2">
            {activeUser && (
              <Link
                href={`/messages?userId=${activeUser.id}`}
                onClick={onClose}
                className="p-1.5 rounded-full text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Open Full Messaging Hub"
              >
                <Maximize2 className="w-4 h-4" />
              </Link>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#64748B] dark:text-[#8E95A5] hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Conversation List Carousel */}
        <div className="p-3 border-b border-black/5 dark:border-white/5 bg-[#F4F5F8] dark:bg-[#0D0E12]/50 flex gap-2 overflow-x-auto no-scrollbar">
          {otherUsers.map(user => {
            const isSelected = activeUser?.id === user.id;
            return (
              <button
                key={user.id}
                onClick={() => setActiveUser(user)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-[#1F222A] border-[#E2FF66] text-[#0D0E12] dark:text-white shadow-sm'
                    : 'bg-transparent border-transparent text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
                }`}
              >
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-black/10 dark:border-white/10">
                  <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
                </div>
                <span className="font-semibold">{user.displayName}</span>
              </button>
            );
          })}
        </div>

        {/* Active Chat Conversation Area */}
        {activeUser ? (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            
            {/* User Profile Bar */}
            <div className="px-4 py-2 bg-[#F8F9FA] dark:bg-[#1F222A]/40 border-b border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[#64748B] dark:text-[#8E95A5]">Chatting with <strong className="text-[#0D0E12] dark:text-white">@{activeUser.username}</strong></span>
              </div>
              <span className="text-[10px] text-[#7B9600] dark:text-[#E2FF66] font-semibold">Active now</span>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-xs text-[#64748B] dark:text-[#8E95A5]">
                  <Sparkles className="w-8 h-8 text-[#7B9600] dark:text-[#E2FF66] mb-2 animate-pulse" />
                  <p>No messages yet with @{activeUser.username}.</p>
                  <p className="mt-1 text-[11px]">Send a note about a recent remix or clothing piece!</p>
                </div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.senderId === currentUser.id;
                  const attachedMix = msg.attachedMixId ? mixes.find(m => m.id === msg.attachedMixId) : null;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                          isMe
                            ? 'bg-[#E2FF66] text-[#0D0E12] font-medium rounded-tr-none shadow-sm'
                            : 'bg-[#F4F5F8] dark:bg-[#1F222A] text-[#0D0E12] dark:text-white rounded-tl-none border border-black/5 dark:border-white/5'
                        }`}
                      >
                        <p>{msg.content}</p>

                        {/* Attached Mix Lookboard Preview */}
                        {attachedMix && (
                          <div className="mt-2 p-2 rounded-xl bg-white dark:bg-[#0D0E12] border border-black/10 dark:border-white/10 text-xs">
                            <span className="text-[9px] font-bold uppercase text-[#7B9600] dark:text-[#E2FF66] block">Lookboard</span>
                            <span className="font-bold text-[#0D0E12] dark:text-white block truncate">{attachedMix.title}</span>
                            <Link
                              href={`/remix?remixMixId=${attachedMix.id}`}
                              onClick={onClose}
                              className="mt-1.5 py-1 px-2.5 rounded-lg bg-[#E2FF66] text-[#0D0E12] text-[10px] font-bold flex items-center justify-center gap-1"
                            >
                              <Repeat className="w-3 h-3 stroke-[2.5]" />
                              <span>Remix in Studio</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Real-time Typing Bubble */}
              {isTargetUserTyping && (
                <div className="flex items-center gap-2 text-xs text-[#64748B] dark:text-[#8E95A5] pl-1 animate-in fade-in">
                  <div className="flex items-center gap-1 bg-[#F4F5F8] dark:bg-[#1F222A] px-3 py-1.5 rounded-2xl rounded-tl-none border border-black/5 dark:border-white/5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7B9600] dark:bg-[#E2FF66] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7B9600] dark:bg-[#E2FF66] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7B9600] dark:bg-[#E2FF66] animate-bounce" />
                  </div>
                  <span className="text-[10px] font-medium text-[#64748B] dark:text-[#8E95A5]">Typing...</span>
                </div>
              )}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSend} className="p-3 border-t border-black/10 dark:border-white/10 flex gap-2">
              <input
                type="text"
                placeholder={`Message @${activeUser.username}...`}
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value);
                  sendTypingStatus(activeUser.id, e.target.value.length > 0);
                }}
                onBlur={() => sendTypingStatus(activeUser.id, false)}
                className="flex-1 px-4 py-2.5 text-xs rounded-full bg-[#F4F5F8] dark:bg-[#0D0E12] text-[#0D0E12] dark:text-white placeholder-[#94A3B8] dark:placeholder-[#6B7280] border border-black/10 dark:border-white/10 focus:outline-none focus:border-[#E2FF66]"
              />
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="p-2.5 rounded-full bg-[#E2FF66] text-[#0D0E12] disabled:opacity-40 hover:bg-[#d5f356] transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 text-center text-xs text-[#64748B] dark:text-[#8E95A5]">
            Select a stylist to start chatting
          </div>
        )}

      </div>
    </div>
  );
}
