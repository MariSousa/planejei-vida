"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { BarChart, Bot, DollarSign, Loader2, PlusCircle, Printer, Target, Trash2, Wallet } from "lucide-react";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { getAdviceAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { type ChartConfig } from "@/components/ui/chart";

const formSchema = z.object({
  income: z.coerce.number({ required_error: "Renda é obrigatória." }).positive("Renda deve ser um valor positivo."),
  expenses: z.coerce.number({ required_error: "Despesas são obrigatórias." }).min(0, "Despesas não podem ser negativas."),
  savingsGoals: z.string().min(10, "Por favor, detalhe mais seus objetivos.").max(500, "Limite de 500 caracteres atingido."),
});

type FinancialData = {
  income: number;
  expenses: number;
  savings: number;
};

type Goal = {
  id: number;
  text: string;
  progress: number;
};

export default function FinancialDashboard() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: undefined,
      expenses: undefined,
      savingsGoals: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      setAdvice(null);
      setFinancialData(null);
      const result = await getAdviceAction(values);

      if (result.success && result.data) {
        setAdvice(result.data.advice);
        setFinancialData({
          income: values.income,
          expenses: values.expenses,
          savings: Math.max(0, values.income - values.expenses),
        });
        toast({
          title: "Análise Completa!",
          description: "Confira seus insights e visualizações abaixo.",
        });
      } else {
        toast({
          title: "Ocorreu um Erro",
          description: result.error || "Não foi possível obter o conselho financeiro. Tente novamente.",
          variant: "destructive",
        });
      }
    });
  };
  
  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, { id: Date.now(), text: newGoal.trim(), progress: Math.floor(Math.random() * 75) }]);
      setNewGoal("");
    }
  };

  const handleRemoveGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };
  
  const chartData = financialData ? [
    { name: "Dados Financeiros", income: financialData.income, expenses: financialData.expenses, savings: financialData.savings }
  ] : [];

  const chartConfig = {
    income: { label: 'Renda', color: 'hsl(var(--chart-1))' },
    expenses: { label: 'Despesas', color: 'hsl(var(--chart-2))' },
    savings: { label: 'Poupança', color: 'hsl(var(--chart-3))' },
  } satisfies ChartConfig;


  return (
    <div id="printable-area" className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
            <Wallet className="text-primary" />
            <span>Informações Financeiras</span>
          </CardTitle>
          <CardDescription>Insira seus dados para uma análise completa e personalizada.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="income"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Renda Mensal (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="5000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expenses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Despesas Mensais (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="3500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="savingsGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metas e Objetivos de Poupança</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ex: Comprar um carro, fazer uma viagem, quitar dívidas..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => window.print()} className="no-print">
                  <Printer className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
                <Button type="submit" disabled={isPending} className="no-print w-40">
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                  Analisar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {(isPending || advice) && (
          <Card className="shadow-lg lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="text-primary" />
                <span>Conselho da IA</span>
              </CardTitle>
              <CardDescription>Recomendações personalizadas para você.</CardDescription>
            </CardHeader>
            <CardContent>
              {isPending ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{advice}</p>
              )}
            </CardContent>
          </Card>
        )}

        {(isPending || financialData) && (
          <Card className="shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="text-primary" />
                <span>Visualização</span>
              </CardTitle>
              <CardDescription>Renda, despesas e poupança.</CardDescription>
            </CardHeader>
            <CardContent>
              {isPending ? (
                 <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-40 w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsBarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" hide />
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                        contentStyle={{
                          background: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                        }}
                    />
                    <Legend />
                    <Bar dataKey="income" name="Renda" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="expenses" name="Despesas" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="savings" name="Poupança" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-primary" />
            <span>Minhas Metas</span>
          </CardTitle>
          <CardDescription>Adicione e acompanhe o progresso das suas metas financeiras.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 no-print">
            <Input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Nova meta..."
              onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
            />
            <Button onClick={handleAddGoal} size="icon">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 space-y-4">
            {goals.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">Você ainda não adicionou nenhuma meta.</p>
            ) : (
              goals.map(goal => (
                <div key={goal.id} className="flex items-center gap-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{goal.text}</p>
                    <Progress value={goal.progress} className="h-2 [&>div]:bg-accent" />
                  </div>
                  <span className="text-sm font-bold text-accent">{goal.progress}%</span>
                  <Button variant="ghost" size="icon" className="no-print" onClick={() => handleRemoveGoal(goal.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
