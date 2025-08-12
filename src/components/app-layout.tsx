
'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { MainNav } from '@/components/main-nav';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { LogoutButton } from '@/components/logout-button';
import { NotificationsPopover } from '@/components/notifications-popover';
import { useFinancials } from '@/hooks/use-financials';
import { UserAvatar } from './user-avatar';
import Link from 'next/link';
import { SearchCommand } from './search-command';
import { VoiceCommandButton } from './voice-command-button';
import { InteractiveTour } from './interactive-tour';

// AppLayout is a Client Component because it uses hooks like usePathname and useAuth.
export function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { upcomingPayments } = useFinancials();
  const [searchOpen, setSearchOpen] = useState(false);
  const [runTour, setRunTour] = useState(false);
  
  // Conditionally render layout based on route
  if (pathname === '/login' || pathname === '/account-deleted' || loading) {
    return <>{children}</>;
  }

  // If not loading and no user, PrivateRoute will handle redirection
  // so we can just return children. PrivateRoute shows its own skeleton.
  if (!user) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
       <InteractiveTour run={runTour} setRun={setRunTour} />
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter>
          <LogoutButton />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm lg:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1">
             {/* This can be a breadcrumb or page title */}
          </div>
          <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Buscar</span>
          </Button>
          <NotificationsPopover upcomingPayments={upcomingPayments} />
          <Link href="/profile">
            <UserAvatar 
              userName={user.displayName || user.email}
              photoURL={user.photoURL}
              className="w-8 h-8"
            />
          </Link>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/40">{React.cloneElement(children as React.ReactElement, { setRunTour })}</main>
        <VoiceCommandButton />
      </SidebarInset>
    </SidebarProvider>
  );
}
