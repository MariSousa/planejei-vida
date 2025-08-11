
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, DollarSign, Wallet, Lightbulb, CreditCard, Target, User } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const menuItems = [
  { href: '/', label: 'Visão Geral', icon: BarChart2 },
  { href: '/income', label: 'Meus Ganhos', icon: DollarSign },
  { href: '/expenses', label: 'Meus Gastos', icon: Wallet },
  { href: '/debts', label: 'Compromissos', icon: CreditCard },
  { href: '/goals', label: 'Meus Sonhos', icon: Target },
  { href: '/advice', label: 'Meu Mentor IA', icon: Lightbulb },
  { href: '/profile', label: 'Meu Perfil', icon: User },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={{children: item.label}}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
