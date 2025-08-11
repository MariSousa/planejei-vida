
'use client';

import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Banknote, Target } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";

export function QuickActions() {
    const actions = [
        { href: '/income', label: 'Ganho', icon: ArrowUp },
        { href: '/expenses', label: 'Gasto', icon: ArrowDown },
        { href: '/debts', label: 'Compromisso', icon: Banknote },
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
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">{label}</span>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
