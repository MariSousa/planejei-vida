'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { Goal } from "@/types";
import Link from "next/link";

interface GoalsProgressCardProps {
    goals: Goal[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export function GoalsProgressCard({ goals }: GoalsProgressCardProps) {
    const sortedGoals = [...goals]
        .sort((a, b) => {
            const progressA = a.targetAmount > 0 ? (a.currentAmount / a.targetAmount) * 100 : 0;
            const progressB = b.targetAmount > 0 ? (b.currentAmount / b.targetAmount) * 100 : 0;
            return progressB - progressA;
        })
        .slice(0, 3);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Metas e Sonhos</CardTitle>
            </CardHeader>
            <CardContent>
                {sortedGoals.length > 0 ? (
                    <div className="space-y-4">
                        {sortedGoals.map(goal => {
                            const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                            return (
                                <div key={goal.id}>
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-sm font-medium">{goal.name}</p>
                                        <p className="text-sm font-semibold">{formatCurrency(goal.targetAmount)}</p>
                                    </div>
                                    <Progress value={progress} className="h-2" />
                                </div>
                            )
                        })}
                         <Button variant="outline" className="w-full mt-4" asChild>
                            <Link href="/goals">Ver todos os sonhos</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col h-[150px] w-full items-center justify-center rounded-lg border-2 border-dashed p-4">
                        <p className="text-center text-sm text-muted-foreground">Nenhum sonho por aqui ainda.</p>
                        <Button variant="link" asChild>
                            <Link href="/goals">Crie sua primeira meta</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
