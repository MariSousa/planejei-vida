'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface OverviewProps {
  data: { name: string; total: number }[];
}

export function Overview({ data }: OverviewProps) {
  return (
    <Card className="h-full">
        <CardHeader>
            <CardTitle>Visão Geral das Despesas</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
             <ResponsiveContainer width="100%" height={350}>
                {data.length > 0 ? (
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `R$${value}`}
                        />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--accent))', opacity: 0.2 }}
                            contentStyle={{
                                background: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: 'var(--radius)',
                            }}
                            labelStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                ) : (
                    <div className="flex h-[350px] w-full items-center justify-center rounded-lg border-2 border-dashed">
                        <p className="text-muted-foreground">Adicione despesas para ver o gráfico.</p>
                    </div>
                )}
            </ResponsiveContainer>
        </CardContent>
    </Card>
   
  );
}
