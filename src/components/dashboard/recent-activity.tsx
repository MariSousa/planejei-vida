
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Income, Expense } from "@/types";
import { ArrowDown, ArrowUp, Wallet } from "lucide-react";
import Link from "next/link";

type Transaction = (Income & { type: 'income' }) | (Expense & { type: 'expense' });

interface RecentActivityProps {
    transactions: (Income | Expense)[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export function RecentActivity({ transactions }: RecentActivityProps) {

    const allTransactions: Transaction[] = transactions.map(t => {
        if ('source' in t) {
            return { ...t, type: 'income' as const };
        }
        return { ...t, type: 'expense' as const };
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Suas últimas 5 transações registradas.</CardDescription>
            </CardHeader>
            <CardContent>
                {allTransactions.length > 0 ? (
                    <div className="space-y-4">
                        {allTransactions.map(item => (
                            <div key={item.id} className="flex items-center">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {item.type === 'income' ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="text-sm font-medium leading-none">{item.type === 'income' ? item.source : item.category}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString('pt-BR')}</p>
                                </div>
                                <div className={`text-sm font-semibold ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col h-[150px] w-full items-center justify-center rounded-lg border-2 border-dashed p-4">
                        <Wallet className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-center text-sm text-muted-foreground">Nenhuma atividade recente.</p>
                         <Button variant="link" asChild>
                            <Link href="/expenses">Adicione seu primeiro gasto</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
