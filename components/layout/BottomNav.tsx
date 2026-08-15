'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Home, Compass, Layers, Bell, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();
  const { currentUser, unreadNotificationsCount, isAuthenticated } = useStore();

  // Hide on landing page for guest / unauthenticated users and on auth routes
  if (!isAuthenticated || pathname === '/signup' || pathname === '/login' || pathname === '/signin' || pathname === '/confirm-email') {
    return null;
  }

  const navItems = [
    { href: '/', icon: Home, label: 'Feed' },
    { href: '/discover', icon: Compass, label: 'Discover' },
    { href: '/remix', icon: Layers, label: 'Remix', isPrimary: true },
    { href: '/notifications', icon: Bell, label: 'Alerts', badge: unreadNotificationsCount },
    { href: `/closet/${currentUser?.username || 'stylist'}`, icon: User, label: 'Closet' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden h-16 pb-[env(safe-area-inset-bottom)] border-t border-black/10 dark:border-white/10 bg-white/95 dark:bg-[#0D0E12]/95 backdrop-blur-lg px-2">
      <div className="h-full flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-3 p-3 rounded-full bg-[#E2FF66] text-[#0D0E12] shadow-[0_0_20px_rgba(226,255,102,0.4)] hover:scale-110 active:scale-95 transition-transform"
                title="Remix Studio"
              >
                <Icon className="w-5 h-5 stroke-[2.5]" />
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors relative ${
                isActive 
                  ? 'text-[#7B9600] dark:text-[#E2FF66]' 
                  : 'text-[#64748B] dark:text-[#8E95A5] hover:text-[#0D0E12] dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
              {Boolean(item.badge && item.badge > 0) && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#E2FF66]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
