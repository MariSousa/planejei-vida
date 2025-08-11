
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
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
  CalendarCheck2
} from 'lucide-react';

const menuItems = [
  { href: '/', label: 'Visão Geral', icon: LayoutDashboard },
  { href: '/income', label: 'Meus Ganhos', icon: Wallet },
  { href: '/expenses', label: 'Meus Gastos', icon: Receipt },
  { href: '/planning', label: 'Planejamento Mensal', icon: CalendarCheck2 },
  { href: '/goals', label: 'Meus Sonhos', icon: Target },
  { href: '/advice', label: 'Meu Mentor IA', icon: BrainCircuit },
  { href: '/profile', label: 'Meu Perfil', icon: User },
  { href: '/reports', label: 'Relatórios', icon: FileText },
];

export function MainNav() {
  const pathname = usePathname();

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
