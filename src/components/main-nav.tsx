
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
} from 'lucide-react';

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
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (window.innerWidth < 768) { // md breakpoint
        setOpenMobile(false);
    }
  };

  const NavItem = ({ href, label, icon: Icon, special = false }: { href: string; label: string; icon: React.ElementType; special?: boolean; }) => {
    const isActive = pathname === href;
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={{ children: label }}
          onClick={handleLinkClick}
          variant={special ? 'special' : 'default'}
        >
          <Link href={href}>
            <Icon />
            <span>{label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };
  
  const NavGroupLabel = ({ label }: { label: string }) => (
    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
      {label}
    </div>
  );

  return (
    <SidebarMenu>
      {mainNavItems.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
      
      <SidebarSeparator />

      <NavGroupLabel label="Ganhos e Gastos" />
      {gainsAndExpensesItems.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}

      <SidebarSeparator />
      
      <NavGroupLabel label="Metas e Investimentos" />
      {goalsAndInvestmentsItems.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
      
      <SidebarSeparator />
      
      <NavGroupLabel label="Ferramentas e Suporte" />
      {toolsItems.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
       {supportItems.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}

    </SidebarMenu>
  );
}
