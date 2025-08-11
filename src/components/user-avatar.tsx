
'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  userName?: string | null;
  photoURL?: string | null;
  className?: string;
}

// A mapping from the string name to the actual icon component
const iconComponentMap = LucideIcons as Record<string, React.ElementType>;

export function UserAvatar({ userName, photoURL, className }: UserAvatarProps) {
  const getInitials = (name?: string | null) => {
    if (!name) return 'P';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const IconComponent = photoURL ? iconComponentMap[photoURL] : null;

  return (
    <Avatar className={cn('bg-primary text-primary-foreground', className)}>
      {IconComponent ? (
        <div className="flex h-full w-full items-center justify-center">
            <IconComponent className="h-[60%] w-[60%]" />
        </div>
      ) : (
        <AvatarFallback className="bg-primary text-primary-foreground font-bold">
          {getInitials(userName)}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
