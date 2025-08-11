
'use client';

import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  userName?: string | null;
  photoURL?: string | null;
  className?: string;
}

export function UserAvatar({ userName, photoURL, className }: UserAvatarProps) {
  const getInitials = (name?: string | null) => {
    if (!name) return 'P';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Avatar className={cn('bg-primary text-primary-foreground', className)}>
      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
        {getInitials(userName)}
      </AvatarFallback>
    </Avatar>
  );
}
