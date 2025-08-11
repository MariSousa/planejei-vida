
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PrivateRoute } from '@/components/private-route';

const formSchema = z.object({
  source: z.string().min(2, { message: 'A fonte deve ter pelo menos 2 caracteres.' }),
  amount: z.coerce.number().positive({ message: 'O valor deve ser positivo.' }),
});

function IncomePageContent() {
  const { income, addIncome, removeIncome, isClient } = useFinancials();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source: '',
      amount: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addIncome(values);
    toast({
      title: 'Renda Adicionada!',
      description: `Renda de ${values.source} adicionada com sucesso.`,
      className: 'border-accent'
    });
    form.reset({source: '', amount: 0});
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };
  
  if (!isClient) {
    return (
        <div className="grid gap-8 md:grid-cols-2">
            <Skeleton className="h-[380px]" />
            <Skeleton className="h-[400px]" />
        </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Nova Renda</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fonte da Renda</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Salário" {...field} />
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
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="1000.00" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Adicionar Renda</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Rendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fonte</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {income.length > 0 ? (
                  income.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.source}</TableCell>
                      <TableCell>{formatCurrency(item.amount)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => removeIncome(item.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remover</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">Nenhuma renda registrada.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function IncomePage() {
    return (
        <PrivateRoute>
            <IncomePageContent />
        </PrivateRoute>
    )
}
