
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface BudgetPieChartProps {
    totalIncome: number;
    totalNecessities: number;
    totalWants: number;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export function BudgetPieChart({ totalIncome, totalNecessities, totalWants }: BudgetPieChartProps) {
    const savings = Math.max(0, totalIncome - (totalNecessities + totalWants));

    const data = [
        { name: 'Necessidades', value: totalNecessities, color: 'hsl(var(--chart-1))' },
        { name: 'Desejos', value: totalWants, color: 'hsl(var(--chart-2))' },
        { name: 'Poupança', value: savings, color: 'hsl(var(--chart-3))' },
    ];
    
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
          return (
            <div className="p-2 bg-background/80 border rounded-md shadow-lg">
              <p className="font-bold">{`${payload[0].name}`}</p>
              <p className="text-sm">{`${formatCurrency(payload[0].value)}`}</p>
            </div>
          );
        }
      
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Resumo do Orçamento</CardTitle>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Em relação ao</p>
                        <p className="text-xs text-muted-foreground">mês anterior</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {totalIncome > 0 ? (
                     <div className="grid grid-cols-2 gap-6 items-center">
                        <div className="w-full h-[150px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={70}
                                        innerRadius={50}
                                        fill="#8884d8"
                                        dataKey="value"
                                        stroke="hsl(var(--background))"
                                        strokeWidth={3}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full space-y-3">
                           {data.map((item, index) => {
                                if (!item) return null;
                                return (
                                    <div key={`item-${index}`} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: item.color, borderRadius: '50%' }}></span>
                                            <span>{item.name}</span>
                                        </div>
                                        <span className="font-medium">{formatCurrency(item.value)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="flex h-[150px] w-full items-center justify-center rounded-lg border-2 border-dashed">
                        <p className="text-center text-muted-foreground">Adicione sua renda para <br /> ver o resumo do orçamento.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
