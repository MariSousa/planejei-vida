
'use client';

import { useAuth } from "@/contexts/auth-context";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "./ui/sidebar";

export function LogoutButton() {
    const { logout, user } = useAuth();

    if (!user) {
        return null;
    }

    return (
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={logout} tooltip={{children: 'Sair'}}>
                    <span>Sair</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
