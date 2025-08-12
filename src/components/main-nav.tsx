
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Landmark,
  Target,
  BrainCircuit,
  User,
  Settings,
  FileText,
  CalendarCheck2,
  PiggyBank,
  BookOpen,
  LifeBuoy
} from 'lucide-react';

const menuItems = [
  { href: '/', label: 'Visão Geral', icon: LayoutDashboard },
  { href: '/income', label: 'Meus Ganhos', icon: Wallet },
  { href: '/expenses', label: 'Meus Gastos', icon: Receipt },
  { href: '/planning', label: 'Planejamento Mensal', icon: CalendarCheck2 },
  { href: '/debts', label: 'Compromissos', icon: Landmark },
  { href: '/goals', label: 'Meus Sonhos', icon: Target },
];

const investmentItems = [
    { href: '/investments', label: 'Minha Carteira', icon: PiggyBank },
    { href: '/investment-types', label: 'Aprenda a Investir', icon: BookOpen },
];

const secondaryMenuItems = [
    { href: '/advice', label: 'Meu Mentor IA', icon: BrainCircuit },
    { href: '/reports', label: 'Relatórios', icon: FileText },
    { href: '/support', label: 'Ajuda e Suporte', icon: LifeBuoy },
]

export function MainNav() {
  const pathname = usePathname();
  const { setOpenMobile, state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  const isInvestmentActive = investmentItems.some(item => pathname.startsWith(item.href));

  return (
    <SidebarMenu className={cn(isCollapsed && 'grid grid-cols-1 gap-2')}>
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
            <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{children: item.label}}
                onClick={handleLinkClick}
            >
                <Link href={item.href}>
                    <Icon />
                    <span>{item.label}</span>
                </Link>
            </SidebarMenuButton>
            </SidebarMenuItem>
        )
      })}
      
      <SidebarMenuItem>
          <SidebarMenuButton
            isSubmenu
            isActive={isInvestmentActive}
            tooltip={{children: "Investimentos"}}
            className="group-data-[collapsible=icon]:flex-col"
          >
              <PiggyBank />
              <span>Investimentos</span> 
          </SidebarMenuButton>
          <SidebarMenuSub>
            {investmentItems.map((item) => {
                return (
                    <SidebarMenuSubItem key={item.href}>
                          <SidebarMenuSubButton
asChild
                              isActive={pathname.startsWith(item.href)}
                          >
                            <Link href={item.href}>
                                  <span>{item.label}</span>
                            </Link>
                          </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                )
            })}
          </SidebarMenuSub>
      </SidebarMenuItem>

      <div className={cn("mt-auto pt-4 border-t border-sidebar-border", isCollapsed && "hidden")}>
          <p className="px-4 text-xs font-semibold text-muted-foreground/80 mb-2">Ferramentas e Suporte</p>
          {secondaryMenuItems.map((item) => {
            const Icon = item.icon;
            return (
                <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{children: item.label}}
                    onClick={handleLinkClick}
                    className="!flex-row !justify-start !h-8 text-sm gap-2"
                >
                    <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
            )
          })}
      </div>
    </SidebarMenu>
  );
}
