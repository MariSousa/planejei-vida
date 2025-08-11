
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const menuItems = [
  { href: '/', label: 'Visão Geral' },
  { href: '/income', label: 'Meus Ganhos' },
  { href: '/expenses', label: 'Meus Gastos' },
  { href: '/debts', label: 'Compromissos' },
  { href: '/goals', label: 'Meus Sonhos' },
  { href: '/advice', label: 'Meu Mentor IA' },
  { href: '/profile', label: 'Meu Perfil' },
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
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
