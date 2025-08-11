
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Banknote, Gem, Target } from 'lucide-react';

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
        { name: 'Necessidades', value: totalNecessities, icon: Target },
        { name: 'Desejos', value: totalWants, icon: Gem },
        { name: 'Poupança', value: savings, icon: Banknote },
    ];

    const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];
    
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (percent * 100 < 5) return null; // Do not render label if slice is too small

        return (
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor="middle" 
                dominantBaseline="central"
                style={{ fontSize: '12px', fontWeight: 'bold', textShadow: '0px 0px 4px rgba(0, 0, 0, 0.5)' }}
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const CustomLegend = (props: any) => {
        const { payload } = props;
        return (
            <ul className="flex flex-col space-y-2 text-sm">
                {payload.map((entry: any, index: number) => {
                    const { color, value: name } = entry;
                    const item = data.find(d => d.name === name);
                    if (!item) return null;
                    const Icon = item.icon;
                    return (
                        <li key={`item-${index}`} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: color, borderRadius: '50%' }}></span>
                                <Icon className="w-4 h-4 text-muted-foreground" />
                                <span>{name}</span>
                            </div>
                            <span className="font-medium">{formatCurrency(item.value)}</span>
                        </li>
                    );
                })}
            </ul>
        );
    };

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
                <CardTitle>Resumo do Orçamento</CardTitle>
                <CardDescription>Sua distribuição de gastos no mês.</CardDescription>
            </CardHeader>
            <CardContent>
                {totalIncome > 0 ? (
                     <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="w-full md:w-1/2 h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={100}
                                        innerRadius={60}
                                        fill="#8884d8"
                                        dataKey="value"
                                        stroke="hsl(var(--background))"
                                        strokeWidth={2}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full md:w-1/2">
                           <CustomLegend payload={data.map((item, index) => ({ value: item.name, color: COLORS[index] }))} />
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
