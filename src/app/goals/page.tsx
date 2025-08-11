
'use client';

import { useFinancials } from '@/hooks/use-financials';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Trash2, PlusCircle, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PrivateRoute } from '@/components/private-route';
import { Progress } from '@/components/ui/progress';
import { GoalContributionDialog } from '@/components/goal-contribution-dialog';

const formSchema = z.object({
  name: z.string().min(3, { message: 'O nome da meta deve ter pelo menos 3 caracteres.' }),
  targetAmount: z.coerce.number().positive({ message: 'O valor alvo deve ser positivo.' }),
  currentAmount: z.coerce.number().min(0, { message: 'O valor atual não pode ser negativo.' }).optional().default(0),
});

function GoalsPageContent() {
  const { goals, addGoal, removeGoal, isClient } = useFinancials();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      targetAmount: undefined,
      currentAmount: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addGoal(values);
    toast({
      title: 'Meta Adicionada!',
      description: `Sua meta "${values.name}" foi criada.`,
      className: 'border-accent'
    });
    form.reset({ name: '', targetAmount: undefined, currentAmount: 0 });
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (!isClient) {
    return (
      <div className="grid gap-8">
        <Skeleton className="h-[400px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Adicionar Nova Meta</CardTitle>
                <CardDescription>Defina seus objetivos financeiros para começar a economizar.</CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-4 items-end">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nome da Meta</FormLabel>
                        <FormControl>
                        <Input placeholder="Ex: Viagem para o Japão" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="targetAmount"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Valor Alvo (R$)</FormLabel>
                        <FormControl>
                        <Input type="number" step="0.01" placeholder="15000.00" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="currentAmount"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Valor Atual (R$)</FormLabel>
                        <FormControl>
                        <Input type="number" step="0.01" placeholder="1000.00" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" className="md:col-span-3">
                    <PlusCircle className="mr-2"/>
                    Adicionar Meta
                </Button>
                </form>
            </Form>
            </CardContent>
        </Card>

        <div>
            <h2 className="text-2xl font-bold mb-4">Minhas Metas</h2>
            {goals.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {goals.map((goal) => {
                    const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                    return (
                        <Card key={goal.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <Target className="w-5 h-5 text-primary" />
                                        <CardTitle className="text-xl">{goal.name}</CardTitle>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeGoal(goal.id)}>
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Remover</span>
                                    </Button>
                                </div>
                                <CardDescription>
                                    Meta de {formatCurrency(goal.targetAmount)}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-2">
                                <Progress value={progress} className="h-2" />
                                <div className="text-sm text-muted-foreground">
                                    <p>
                                        <span className="font-semibold text-foreground">{formatCurrency(goal.currentAmount)}</span> de {formatCurrency(goal.targetAmount)}
                                    </p>
                                    <p className="text-right font-bold text-accent">{progress.toFixed(0)}%</p>
                                </div>
                            </CardContent>
                            <CardFooter>
                               <GoalContributionDialog goal={goal} />
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
            ) : (
            <div className="flex h-[200px] w-full items-center justify-center rounded-lg border-2 border-dashed">
                <p className="text-center text-muted-foreground">Você ainda não tem metas.<br/>Adicione uma para começar!</p>
            </div>
            )}
        </div>
    </div>
  );
}

export default function GoalsPage() {
    return (
        <PrivateRoute>
            <GoalsPageContent />
        </PrivateRoute>
    )
}
