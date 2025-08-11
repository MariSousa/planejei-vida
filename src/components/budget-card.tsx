
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, Gem, Banknote } from 'lucide-react';

interface BudgetCardProps {
    totalIncome: number;
    totalNecessities: number;
    totalWants: number;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export function BudgetCard({ totalIncome, totalNecessities, totalWants }: BudgetCardProps) {
    const budget50 = totalIncome * 0.5;
    const budget30 = totalIncome * 0.3;
    const budget20 = totalIncome * 0.2;

    const savings = totalIncome > 0 ? totalIncome - (totalNecessities + totalWants) : 0;
    
    const necessitiesProgress = totalIncome > 0 && budget50 > 0 ? (totalNecessities / budget50) * 100 : 0;
    const wantsProgress = totalIncome > 0 && budget30 > 0 ? (totalWants / budget30) * 100 : 0;
    const savingsProgress = totalIncome > 0 && budget20 > 0 ? (savings / budget20) * 100 : 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Orçamento 50/30/20</CardTitle>
                <CardDescription>
                    Distribuição da sua renda segundo a metodologia.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {totalIncome > 0 ? (
                    <>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="flex items-center gap-2"><Target className="w-4 h-4 text-muted-foreground" />Necessidades</span>
                                <span>{formatCurrency(budget50)}</span>
                            </div>
                            <Progress value={necessitiesProgress > 100 ? 100 : necessitiesProgress} />
                            <p className="text-xs text-muted-foreground text-right">{formatCurrency(totalNecessities)} de {formatCurrency(budget50)} gastos</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="flex items-center gap-2"><Gem className="w-4 h-4 text-muted-foreground" />Desejos</span>
                                <span>{formatCurrency(budget30)}</span>
                            </div>
                            <Progress value={wantsProgress > 100 ? 100 : wantsProgress} /> 
                            <p className="text-xs text-muted-foreground text-right">{formatCurrency(totalWants)} de {formatCurrency(budget30)} gastos</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="flex items-center gap-2"><Banknote className="w-4 h-4 text-muted-foreground" />Poupança</span>
                                <span>{formatCurrency(budget20)}</span>
                            </div>
                            <Progress value={savingsProgress > 0 ? savingsProgress : 0} className="[&>div]:bg-accent" />
                            <p className="text-xs text-muted-foreground text-right">{formatCurrency(savings)} de {formatCurrency(budget20)} guardados</p>
                        </div>
                    </>
                ) : (
                    <div className="flex h-[200px] w-full items-center justify-center rounded-lg border-2 border-dashed">
                        <p className="text-center text-muted-foreground">Adicione sua renda para <br/> ver o orçamento 50/30/20.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
