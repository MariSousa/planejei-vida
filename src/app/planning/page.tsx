
'use client';

import React, { useState, useMemo } from 'react';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarIcon, Trash2, CheckCircle, Circle, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PrivateRoute } from '@/components/private-route';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { type Priority, type Status } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SummaryCard } from '@/components/summary-card';
import { ArrowLeft, ArrowRight, TrendingDown, TrendingUp, Wallet } from 'lucide-react';


const formSchema = z.object({
  name: z.string().min(2, { message: 'A descrição deve ter pelo menos 2 caracteres.' }),
  amount: z.coerce.number().positive({ message: 'O valor deve ser positivo.' }),
  dueDate: z.date({ required_error: 'A data de vencimento é obrigatória.' }),
  priority: z.enum(['Alta', 'Média', 'Baixa'], { required_error: 'A prioridade é obrigatória.' }),
});

function PlanningPageContent() {
  const { 
    monthlyPlanItems, 
    addPlanItem, 
    removePlanItem,
    updatePlanItemStatus, 
    isClient,
    planningTotals,
    currentMonth,
    setCurrentMonth
  } = useFinancials();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      amount: undefined,
      dueDate: undefined,
      priority: 'Média',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        await addPlanItem({
            ...values,
            dueDate: values.dueDate.toISOString(),
            priority: values.priority as Priority,
        });
        toast({
            title: 'Item Adicionado ao Plano!',
            description: `"${values.name}" foi adicionado ao seu planejamento.`,
            className: 'border-accent'
        });
        form.reset({ name: '', amount: undefined, dueDate: undefined, priority: 'Média' });
    } catch (error) {
         toast({
            title: 'Erro',
            description: 'Não foi possível adicionar o item ao plano.',
            variant: 'destructive'
        });
    }
  }

  const handleStatusChange = async (id: string, currentStatus: Status) => {
    const newStatus: Status = currentStatus === 'Previsto' ? 'Pago' : 'Previsto';
    try {
        await updatePlanItemStatus(id, newStatus);
        toast({
            title: 'Status Atualizado!',
            description: `O item foi marcado como ${newStatus.toLowerCase()}.`,
        });
    } catch (error) {
        toast({
            title: 'Erro',
            description: 'Não foi possível atualizar o status.',
            variant: 'destructive'
        });
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string) => {
      return format(new Date(dateString), "dd 'de' MMMM", { locale: ptBR });
  }

  const priorityBadgeVariant = {
    'Alta': 'destructive',
    'Média': 'secondary',
    'Baixa': 'default',
  };
  
  if (!isClient) {
    return (
        <div className="flex flex-col gap-6">
            <Skeleton className="h-12 w-1/2 mx-auto" />
            <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
            <Skeleton className="h-[480px]" />
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
        <div className="flex justify-center items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold font-headline text-center capitalize">
                {format(currentMonth, 'MMMM, yyyy', { locale: ptBR })}
            </h1>
            <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ArrowRight className="h-4 w-4" />
            </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <SummaryCard 
                title="Ganhos Previstos"
                value={formatCurrency(planningTotals.plannedIncome)}
                icon={<TrendingUp className="text-green-500" />}
                className="border-green-500/50"
            />
            <SummaryCard 
                title="Gastos Previstos"
                value={formatCurrency(planningTotals.plannedExpenses)}
                icon={<TrendingDown className="text-red-500" />}
                className="border-red-500/50"
            />
             <SummaryCard 
                title="Sobra Prevista"
                value={formatCurrency(planningTotals.expectedSurplus)}
                icon={<Wallet className="text-blue-500" />}
                className="border-blue-500/50"
            />
        </div>
      
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
         <Card className="lg:col-span-1">
            <CardHeader>
            <CardTitle>Adicionar ao Plano</CardTitle>
            <CardDescription>Insira ganhos ou despesas para este mês.</CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                        <Input placeholder="Ex: Fatura do Cartão" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Valor Previsto</FormLabel>
                        <FormControl>
                        <Input type="number" step="0.01" placeholder="850,00" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Prioridade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a prioridade" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="Alta">Alta</SelectItem>
                            <SelectItem value="Média">Média</SelectItem>
                            <SelectItem value="Baixa">Baixa</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Data de Vencimento</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, 'dd/MM/yyyy')
                                    ) : (
                                        <span>Selecione uma data</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    defaultMonth={currentMonth}
                                    initialFocus
                                    locale={ptBR}
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                <Button type="submit">Adicionar Item</Button>
                </form>
            </Form>
            </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
            <CardHeader>
            <CardTitle>Itens do Mês</CardTitle>
            <CardDescription>Sua lista de ganhos e despesas para o mês selecionado.</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="border rounded-md">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-16">Status</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right w-12">Ação</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {monthlyPlanItems.length > 0 ? (
                    monthlyPlanItems.map((item) => (
                        <TableRow key={item.id} className={cn(item.status === 'Pago' && 'text-muted-foreground line-through')}>
                        <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => handleStatusChange(item.id, item.status as Status)}>
                               {item.status === 'Pago' ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5" />}
                            </Button>
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                            <Badge variant={priorityBadgeVariant[item.priority as Priority] || 'default'}>
                                {item.priority}
                            </Badge>
                        </TableCell>
                        <TableCell>{formatDate(item.dueDate)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => removePlanItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remover</span>
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">Nenhum item planejado para este mês.</TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PlanningPage() {
    return (
        <PrivateRoute>
            <PlanningPageContent />
        </PrivateRoute>
    )
}
