
'use client';

import { Card, CardContent } from "@/components/ui/card";

interface BalanceCardProps {
    greeting: string;
    userName: string;
    balance: number;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export function BalanceCard({ greeting, userName, balance }: BalanceCardProps) {
    return (
        <Card className="bg-primary text-primary-foreground shadow-lg">
            <CardContent className="p-6">
                <div className="text-sm opacity-90">{greeting}, {userName}!</div>
                <div className="mt-2">
                    <div className="text-xs opacity-80">Seu saldo atual é</div>
                    <div className="text-3xl font-bold tracking-tight">{formatCurrency(balance)}</div>
                </div>
            </CardContent>
        </Card>
    );
}
