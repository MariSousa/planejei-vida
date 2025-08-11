
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
import { Calculator, Loader2 } from 'lucide-react';
import { type SimulationResult, calculateInvestment } from '@/ai/flows/investment-calculator';
import { Skeleton } from './ui/skeleton';


const formSchema = z.object({
  initialAmount: z.coerce.number().min(0, { message: 'O valor inicial deve ser zero ou maior.' }),
  monthlyContribution: z.coerce.number().min(0, { message: 'O aporte mensal deve ser zero ou maior.' }),
  yieldRate: z.coerce.number().positive({ message: 'O rendimento deve ser positivo.' }),
  periodInMonths: z.coerce.number().int().positive({ message: 'O prazo deve ser de pelo menos 1 mês.' }),
});

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export function InvestmentSimulator() {
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialAmount: 1000,
      monthlyContribution: 100,
      yieldRate: 100, // 100% of CDI
      periodInMonths: 12,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const result = await calculateInvestment(values);
      setResults(result);
    } catch (e) {
      console.error(e);
      setError("Ocorreu um erro ao calcular o rendimento. Tente novamente.");
    } finally {
        setIsLoading(false);
    }
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
                                    <Input type="number" step="100" placeholder="1000" {...field} value={field.value ?? ''} />
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
                                    <Input type="number" step="50" placeholder="100" {...field} value={field.value ?? ''} />
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
                                    <Input type="number" step="10" placeholder="100" {...field} value={field.value ?? ''} />
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
                                    <Input type="number" placeholder="12" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        A simulação usa uma taxa CDI de referência para o cálculo.
                    </p>
                    <Button type="submit" disabled={isLoading}>
                         {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Simular Rendimentos
                    </Button>
                </form>
                </Form>
            </div>

            <div>
                <h3 className="font-semibold mb-2">Resultado da Simulação</h3>
                {isLoading ? (
                     <div className="space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : error ? (
                     <div className="flex h-full min-h-[150px] items-center justify-center rounded-lg border border-destructive bg-destructive/10 text-destructive text-sm p-4">
                        <p className="text-center">{error}</p>
                    </div>
                ) : results ? (
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
                                    <TableCell className="text-right">{formatCurrency(results.totalInvested)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Rendimento Líquido (após IR)</TableCell>
                                    <TableCell className="text-right text-green-600 font-medium">{formatCurrency(results.netYield)}</TableCell>
                                </TableRow>
                                 <TableRow className="bg-muted/50 font-bold">
                                    <TableCell>Montante Final</TableCell>
                                    <TableCell className="text-right">{formatCurrency(results.finalAmount)}</TableCell>
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
