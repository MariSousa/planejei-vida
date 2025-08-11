
'use client';

import { useState } from 'react';
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
import { Trash2, CheckCircle, Circle, CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PrivateRoute } from '@/components/private-route';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Debt } from '@/types';

const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  amount: z.coerce.number().positive({ message: 'O valor deve ser positivo.' }),
  dueDate: z.date({ required_error: 'A data de vencimento é obrigatória.'}),
});

function DebtsPageContent() {
  const { debts, addDebt, removeDebt, updateDebtStatus, isClient } = useFinancials();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      amount: undefined,
      dueDate: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newDebt = {
        ...values,
        dueDate: values.dueDate.toISOString(),
        status: 'Pendente' as const,
    };
    await addDebt(newDebt);
    toast({
      title: 'Compromisso Adicionado!',
      description: `Seu compromisso "${values.name}" foi adicionado.`,
      className: 'border-accent'
    });
    form.reset({ name: '', amount: undefined, dueDate: undefined });
  }

  const handleStatusChange = async (debt: Debt) => {
    const newStatus = debt.status === 'Pendente' ? 'Pago' : 'Pendente';
    await updateDebtStatus(debt.id, newStatus);
     toast({
      title: 'Status Alterado!',
      description: `O compromisso "${debt.name}" foi marcado como ${newStatus}.`,
    });
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string) => {
      return format(new Date(dateString), "dd/MM/yyyy");
  }

  const totalDebts = debts.filter(d => d.status === 'Pendente').reduce((acc, debt) => acc + debt.amount, 0);

  if (!isClient) {
    return (
      <div className="grid gap-8 md:grid-cols-2">
        <Skeleton className="h-[380px]" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
            <CardTitle>Visão Geral dos Compromissos a Quitar</CardTitle>
            <CardDescription>O valor total dos seus compromissos pendentes.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-3xl font-bold text-destructive">{formatCurrency(totalDebts)}</p>
        </CardContent>
      </Card>
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Compromisso</CardTitle>
            <CardDescription>Cadastre dívidas, financiamentos ou saldos de cartão de crédito que você deseja quitar.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Compromisso</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Fatura do Cartão, Empréstimo Pessoal" {...field} />
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
                      <FormLabel>Valor Total (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="850.00" {...field} value={field.value ?? ''} />
                      </FormControl>
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
                                        format(field.value, 'PPP', { locale: ptBR })
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
                                    initialFocus
                                    locale={ptBR}
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                <Button type="submit">Adicionar Compromisso</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de Compromissos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {debts.length > 0 ? (
                    debts.map((item) => (
                      <TableRow key={item.id} className={cn(item.status === 'Pago' && 'text-muted-foreground line-through')}>
                        <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => handleStatusChange(item)}>
                               {item.status === 'Pago' ? <CheckCircle className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5" />}
                            </Button>
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{formatDate(item.dueDate)}</TableCell>
                        <TableCell>{formatCurrency(item.amount)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => removeDebt(item.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remover</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">Nenhum compromisso registrado.</TableCell>
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

export default function DebtsPage() {
    return (
        <PrivateRoute>
            <DebtsPageContent />
        </PrivateRoute>
    )
}
