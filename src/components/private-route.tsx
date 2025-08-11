
'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from './ui/skeleton';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect in dev mode if we are not on the login page, 
    // as we are likely using a mock user.
    if (process.env.NODE_ENV === 'development') {
        return;
    }
    
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="p-8">
            <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center">
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-10 w-36" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <Skeleton className="h-[286px] xl:col-span-1" />
                    <Skeleton className="h-[422px] xl:col-span-2" />
                </div>
            </div>
        </div>
    );
  }

  return <>{children}</>;
}
