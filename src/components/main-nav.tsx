
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Landmark,
  Target,
  BrainCircuit,
  FileText,
  CalendarCheck2,
  PiggyBank,
  BookOpen,
  LifeBuoy,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const mainNavItems = [
    { href: '/', label: 'Visão Geral', icon: LayoutDashboard },
];

const gainsAndExpensesItems = [
    { href: '/income', label: 'Meus Ganhos', icon: Wallet },
    { href: '/expenses', label: 'Meus Gastos', icon: Receipt },
    { href: '/planning', label: 'Planejamento', icon: CalendarCheck2 },
    { href: '/debts', label: 'Compromissos', icon: Landmark },
];

const goalsAndInvestmentsItems = [
    { href: '/goals', label: 'Meus Sonhos', icon: Target },
    { href: '/investments', label: 'Minha Carteira', icon: PiggyBank },
    { href: '/investment-types', label: 'Aprenda a Investir', icon: BookOpen },
];

const toolsItems = [
    { href: '/advice', label: 'Meu Mentor IA', icon: BrainCircuit, special: true },
    { href: '/reports', label: 'Relatórios', icon: FileText },
];

const supportItems = [
     { href: '/support', label: 'Ajuda & Suporte', icon: LifeBuoy },
];

export function MainNav() {
  const pathname = usePathname();
  const { setOpenMobile, state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const handleLinkClick = () => {
    if (window.innerWidth < 768) { // md breakpoint
        setOpenMobile(false);
    }
  };

  const isGroupActive = (items: { href: string }[]) => items.some(item => pathname === item.href);

  return (
    <SidebarMenu>
      {mainNavItems.map((item) => {
        const Icon = item.icon;
        return (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{children: item.label}}
                    onClick={handleLinkClick}
                    className="justify-start text-sm"
                >
                    <Link href={item.href}>
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
      })}
      
      <SidebarSeparator />

      {/* Ganhos e Gastos */}
       <Collapsible>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        isActive={isGroupActive(gainsAndExpensesItems)}
                        tooltip={{children: "Ganhos e Gastos"}}
                    >
                        <Wallet />
                        <span>Ganhos e Gastos</span> 
                    </SidebarMenuButton>
                </CollapsibleTrigger>
            </SidebarMenuItem>
            <CollapsibleContent>
                <SidebarMenuSub>
                    {gainsAndExpensesItems.map((item) => (
                        <SidebarMenuSubItem key={item.href}>
                            <SidebarMenuSubButton asChild isActive={pathname === item.href} onClick={handleLinkClick}>
                                <Link href={item.href}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    ))}
                </SidebarMenuSub>
            </CollapsibleContent>
        </Collapsible>

       {/* Metas e Investimentos */}
        <Collapsible>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        isActive={isGroupActive(goalsAndInvestmentsItems)}
                        tooltip={{children: "Metas e Investimentos"}}
                    >
                        <Target />
                        <span>Metas e Investimentos</span> 
                    </SidebarMenuButton>
                </CollapsibleTrigger>
            </SidebarMenuItem>
            <CollapsibleContent>
                <SidebarMenuSub>
                    {goalsAndInvestmentsItems.map((item) => (
                        <SidebarMenuSubItem key={item.href}>
                            <SidebarMenuSubButton asChild isActive={pathname === item.href} onClick={handleLinkClick}>
                                <Link href={item.href}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    ))}
                </SidebarMenuSub>
            </CollapsibleContent>
        </Collapsible>
      
      <SidebarSeparator />
      
       {/* Ferramentas */}
      {toolsItems.map((item) => {
        const Icon = item.icon;
        return (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{children: item.label}}
                    onClick={handleLinkClick}
                    variant={item.special ? 'special' : 'default'}
                >
                    <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
      })}
      
      {/* Suporte */}
       {supportItems.map((item) => {
        const Icon = item.icon;
        return (
            <SidebarMenuItem key={item.href} className="mt-auto">
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

    </SidebarMenu>
  );
}
