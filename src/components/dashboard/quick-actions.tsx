
'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { Wallet, Receipt, Landmark, Target } from "lucide-react";

export function QuickActions() {
    const actions = [
        { href: '/income', label: 'Ganho', icon: Wallet },
        { href: '/expenses', label: 'Gasto', icon: Receipt },
        { href: '/debts', label: 'Compromisso', icon: Landmark },
        { href: '/goals', label: 'Sonho', icon: Target },
    ];

    return (
        <Card>
            <CardContent className="p-4">
                 <div className="grid grid-cols-4 gap-2 text-center">
                    {actions.map(({ href, label, icon: Icon }) => (
                        <Link
                            href={href}
                            key={href}
                            className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
                                <Icon className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">{label}</span>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
