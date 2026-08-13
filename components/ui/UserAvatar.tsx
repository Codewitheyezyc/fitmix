'use client';

import React, { useState } from 'react';

interface UserAvatarProps {
  src?: string | null;
  name?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
}

const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base font-bold',
  xl: 'w-18 h-18 w-[72px] h-[72px] text-xl font-black'
};

export default function UserAvatar({
  src,
  name = 'Stylist',
  className = '',
  size = 'md',
  border = true
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const cleanSrc = src && typeof src === 'string' && src.trim().length > 5 ? src.trim() : null;
  const initial = (name && name.trim().length > 0 ? name.trim()[0] : 'S').toUpperCase();

  const borderClass = border ? 'border-2 border-[#E2FF66]' : '';
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  if (cleanSrc && !imgError) {
    return (
      <div className={`relative rounded-full overflow-hidden flex-shrink-0 bg-black/5 dark:bg-white/5 ${sizeClass} ${borderClass} ${className}`}>
        <img
          src={cleanSrc}
          alt=""
          onError={() => setImgError(true)}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold bg-[#E2FF66]/20 dark:bg-[#E2FF66]/15 text-[#0D0E12] dark:text-[#E2FF66] select-none ${sizeClass} ${borderClass} ${className}`}
    >
      <span>{initial}</span>
    </div>
  );
}
