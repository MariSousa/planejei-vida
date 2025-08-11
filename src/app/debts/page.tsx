
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
import { CalendarIcon, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PrivateRoute } from '@/components/private-route';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';


const formSchema = z.object({
  name: z.string().min(2, { message: 'A descrição deve ter pelo menos 2 caracteres.' }),
  amount: z.coerce.number().positive({ message: 'O valor deve ser positivo.' }),
  dueDate: z.date({ required_error: 'A data de vencimento é obrigatória.' }),
});

function DebtsPageContent() {
  const { debts, addDebt, removeDebt, isClient } = useFinancials();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      amount: undefined,
      dueDate: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addDebt({
      ...values,
      dueDate: values.dueDate.toISOString(),
    });
    toast({
      title: 'Compromisso Adicionado!',
      description: `Compromisso "${values.name}" adicionado com sucesso.`,
      className: 'border-accent'
    });
    form.reset({name: '', amount: undefined, dueDate: undefined});
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string) => {
      return format(new Date(dateString), "dd 'de' MMMM", { locale: ptBR });
  }
  
  if (!isClient) {
    return (
        <div className="grid gap-8 md:grid-cols-2">
            <Skeleton className="h-[480px]" />
            <Skeleton className="h-[400px]" />
        </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Compromisso</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do Compromisso</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Fatura do Cartão de Crédito" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Valor Total</FormLabel>
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
                        <FormItem className="flex flex-col pt-2">
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
                                    disabled={(date) =>
                                        date < new Date(new Date().setHours(0,0,0,0))
                                    }
                                    initialFocus
                                    locale={ptBR}
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
               </div>
              <Button type="submit">Adicionar Compromisso</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Próximos Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {debts.length > 0 ? (
                  debts.map((item) => (
                    <TableRow key={item.id}>
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
                    <TableCell colSpan={4} className="h-24 text-center">Nenhum compromisso registrado.</TableCell>
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

export default function DebtsPage() {
    return (
        <PrivateRoute>
            <DebtsPageContent />
        </PrivateRoute>
    )
}
