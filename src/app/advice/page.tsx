
'use client';

import { useState, useMemo } from 'react';
import { useFinancials } from '@/hooks/use-financials';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getSavingsAdvice } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Lightbulb, Trash2, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { PrivateRoute } from '@/components/private-route';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const formSchema = z.object({
  goalId: z.string({ required_error: 'Por favor, selecione uma meta.' }),
});

function AdvicePageContent() {
  const { totals, expenses, debts, goals, addAdvice, advices, removeAdvice, isClient } = useFinancials();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goalId: undefined,
    },
  });

  const expenseData = useMemo(() => expenses.map(e => ({ category: e.category, amount: e.amount })), [expenses]);
  const debtData = useMemo(() => debts.map(d => ({ name: d.name, amount: d.amount })), [debts]);
  const goalData = useMemo(() => goals.map(g => ({ name: g.name, targetAmount: g.targetAmount, currentAmount: g.currentAmount })), [goals]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    
    const selectedGoal = goals.find(g => g.id === values.goalId);
    if (!selectedGoal) {
      setError("Meta selecionada não encontrada.");
      setIsLoading(false);
      return;
    }

    const input = {
      income: totals.totalIncome,
      expenses: expenseData,
      debts: debtData,
      goals: goalData,
      savingsGoal: selectedGoal.name,
      goalId: selectedGoal.id,
    };

    const result = await getSavingsAdvice(input);

    if (result.error) {
        setError(result.error);
    } else if (result.advice) {
        await addAdvice({
            goalId: selectedGoal.id,
            goalName: selectedGoal.name,
            adviceText: result.advice,
        });
        toast({
            title: "Conselho Salvo!",
            description: "Seu novo plano de ação foi salvo e está sendo monitorado.",
            className: "border-accent",
        });
        form.reset();
    }
    
    setIsLoading(false);
  }

  const getGoalProgress = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal || goal.targetAmount <= 0) return 0;
    return (goal.currentAmount / goal.targetAmount) * 100;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };
  
  if (!isClient) {
    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[50px] w-1/3" />
            <Skeleton className="h-[250px] w-full" />
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold font-headline">FinMentor: Seu Consultor Pessoal</h1>
        <p className="text-muted-foreground mt-2">
          Selecione uma meta para receber um plano de ação personalizado e acompanhe seu progresso.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerar Novo Plano de Ação</CardTitle>
          <CardDescription>
            Escolha uma das suas metas financeiras para que o FinMentor crie um conselho sob medida para você.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {goals.length > 0 ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="goalId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qual meta você quer focar agora?</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma meta..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {goals.map(goal => (
                            <SelectItem key={goal.id} value={goal.id}>
                              {goal.name} ({formatCurrency(goal.targetAmount)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? 'Analisando seus dados...' : 'Obter Conselho do FinMentor'}
                </Button>
              </form>
            </Form>
           ) : (
            <Alert variant="default" className="border-accent">
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Nenhuma meta encontrada!</AlertTitle>
                <AlertDescription>
                    Você precisa ter pelo menos uma meta criada para receber um conselho. 
                    <Button variant="link" asChild className="p-1 h-auto">
                        <Link href="/goals">Crie sua primeira meta aqui.</Link>
                    </Button>
                </AlertDescription>
            </Alert>
           )}
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erro na Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Meus Planos de Ação</h2>
        {advices.length > 0 ? (
          <div className="space-y-4">
            {advices.map(advice => {
                const progress = getGoalProgress(advice.goalId);
                const goal = goals.find(g => g.id === advice.goalId);

                return (
                    <Card key={advice.id} className={`bg-accent/20 border-accent ${progress >= 100 ? 'border-green-500' : ''}`}>
                        <CardHeader>
                             <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        {progress >= 100 && <CheckCircle2 className="text-green-500" />}
                                        Plano para: {advice.goalName}
                                    </CardTitle>
                                    <CardDescription>Gerado em: {new Date(advice.date).toLocaleDateString('pt-BR')}</CardDescription>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeAdvice(advice.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                             </div>
                        </CardHeader>
                        <CardContent>
                            <div className="whitespace-pre-wrap text-sm text-foreground/90 p-4 bg-background/50 rounded-md mb-4">{advice.adviceText}</div>
                            {goal && (
                                <div>
                                    <div className="mb-2 text-sm font-medium">Progresso da Meta</div>
                                    <Progress value={progress} className="h-2 mb-1" />
                                    <p className="text-xs text-muted-foreground text-right">
                                        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)} ({progress.toFixed(0)}%)
                                    </p>
                                </div>
                            )}
                             {progress >= 100 && (
                                 <Alert className="mt-4 border-green-500 text-green-700">
                                    <CheckCircle2 className="h-4 w-4 !text-green-500" />
                                    <AlertTitle>Parabéns!</AlertTitle>
                                    <AlertDescription>
                                        Você concluiu o objetivo deste plano de ação!
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
          </div>
        ) : (
             <div className="flex h-[150px] w-full items-center justify-center rounded-lg border-2 border-dashed">
                <p className="text-center text-muted-foreground">Você ainda não gerou nenhum plano.<br/>Selecione uma meta acima para começar!</p>
            </div>
        )}
      </div>
    </div>
  );
}

export default function AdvicePage() {
    return (
        <PrivateRoute>
            <AdvicePageContent />
        </PrivateRoute>
    )
}
