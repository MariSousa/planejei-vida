
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calculator, TrendingUp } from 'lucide-react';

const formSchema = z.object({
  initialAmount: z.coerce.number().min(0, { message: 'O valor inicial deve ser zero ou maior.' }),
  monthlyContribution: z.coerce.number().min(0, { message: 'O aporte mensal deve ser zero ou maior.' }),
  yieldRate: z.coerce.number().positive({ message: 'O rendimento deve ser positivo.' }),
  periodInMonths: z.coerce.number().int().positive({ message: 'O prazo deve ser de pelo menos 1 mês.' }),
});

interface SimulationResult {
  month: number;
  totalInvested: number;
  netYield: number;
  finalAmount: number;
}

// Assuming a constant CDI rate for simulation purposes. In a real-world app, this would be dynamic.
const MOCK_CDI_RATE_ANNUAL = 0.105; // 10.5%

const getIrRate = (days: number): number => {
  if (days <= 180) return 0.225; // 22.5%
  if (days <= 360) return 0.200; // 20.0%
  if (days <= 720) return 0.175; // 17.5%
  return 0.150; // 15.0%
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export function InvestmentSimulator() {
  const [results, setResults] = useState<SimulationResult[] | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialAmount: 1000,
      monthlyContribution: 100,
      yieldRate: 100, // 100% of CDI
      periodInMonths: 12,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { initialAmount, monthlyContribution, yieldRate, periodInMonths } = values;
    
    const effectiveAnnualRate = MOCK_CDI_RATE_ANNUAL * (yieldRate / 100);
    const monthlyRate = Math.pow(1 + effectiveAnnualRate, 1 / 12) - 1;

    let totalAmount = initialAmount;
    let totalInvested = initialAmount;
    const simulationResults: SimulationResult[] = [];

    for (let month = 1; month <= periodInMonths; month++) {
      if (month > 1) {
        totalAmount += monthlyContribution;
        totalInvested += monthlyContribution;
      } else if (month === 1 && initialAmount === 0) {
        // If initial amount is 0, the first contribution happens in month 1
        totalAmount += monthlyContribution;
        totalInvested += monthlyContribution;
      }
      
      const grossYieldOfMonth = totalAmount * monthlyRate;
      totalAmount += grossYieldOfMonth;
    }

    const grossYieldTotal = totalAmount - totalInvested;
    const daysInvested = periodInMonths * 30; // Approximation
    const irRate = getIrRate(daysInvested);
    const irValue = grossYieldTotal * irRate;
    const netYield = grossYieldTotal - irValue;
    const finalAmount = totalInvested + netYield;
    
    setResults([{
        month: periodInMonths,
        totalInvested,
        netYield,
        finalAmount,
    }]);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Calculator />
            Simulador de Rendimentos
        </CardTitle>
        <CardDescription>
          Projete o crescimento dos seus investimentos de renda fixa atrelados ao CDI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
            <div>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="initialAmount"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Valor Inicial (R$)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="100" placeholder="1000" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="monthlyContribution"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Aporte Mensal (R$)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="50" placeholder="100" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="yieldRate"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Rendimento (% do CDI)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="10" placeholder="100" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="periodInMonths"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Prazo (meses)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="12" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Simulação baseada em uma taxa CDI de {(MOCK_CDI_RATE_ANNUAL * 100).toFixed(2)}% ao ano.
                    </p>
                    <Button type="submit">Simular Rendimentos</Button>
                </form>
                </Form>
            </div>

            <div>
                <h3 className="font-semibold mb-2">Resultado da Simulação</h3>
                {results ? (
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Descrição</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Total Investido</TableCell>
                                    <TableCell className="text-right">{formatCurrency(results[0].totalInvested)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Rendimento Líquido (após IR)</TableCell>
                                    <TableCell className="text-right text-green-600 font-medium">{formatCurrency(results[0].netYield)}</TableCell>
                                </TableRow>
                                 <TableRow className="bg-muted/50 font-bold">
                                    <TableCell>Montante Final</TableCell>
                                    <TableCell className="text-right">{formatCurrency(results[0].finalAmount)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="flex h-full min-h-[150px] items-center justify-center rounded-lg border-2 border-dashed">
                        <p className="text-center text-muted-foreground">Preencha os dados e clique em<br/> "Simular" para ver a projeção.</p>
                    </div>
                )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
