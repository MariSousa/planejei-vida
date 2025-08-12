'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
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
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  const isInvestmentActive = investmentItems.some(item => pathname.startsWith(item.href));

  return (
    <SidebarMenu>
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
      
      {/* Investment Dropdown */}
      <SidebarMenuItem>
          <SidebarMenuButton
            isSubmenu
            isActive={isInvestmentActive}
            tooltip={{children: "Investimentos"}}
          >
              <PiggyBank />
              <span>Investimentos</span>
          </SidebarMenuButton>
          <ul className="space-y-1 py-1 data-[state=closed]:hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
              {investmentItems.map((item) => {
                  const Icon = item.icon;
                  return (
                      <li key={item.href}>
                           <SidebarMenuButton
                                asChild
                                isActive={pathname.startsWith(item.href)}
                                className="h-8"
                           >
                               <Link href={item.href}>
                                    <Icon />
                                    <span>{item.label}</span>
                               </Link>
                           </SidebarMenuButton>
                      </li>
                  )
              })}
          </ul>
      </SidebarMenuItem>

      <div className="mt-auto pt-4 border-t border-sidebar-border">
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
