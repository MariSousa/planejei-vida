
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PrivateRoute } from '@/components/private-route';

const expenseCategoryGroups = [
    {
        label: 'Moradia',
        options: ['Aluguel', 'Financiamento', 'Condomínio', 'IPTU', 'Luz', 'Água', 'Gás', 'Internet', 'Telefone', 'Streaming TV', 'Seguro Residencial', 'Manutenção', 'Limpeza']
    },
    {
        label: 'Alimentação',
        options: ['Supermercado', 'Padaria', 'Açougue/Peixaria', 'Restaurante', 'Lanchonete', 'Delivery', 'Café', 'Bebidas']
    },
    {
        label: 'Transporte',
        options: ['Combustível', 'Transporte Público', 'App de Transporte', 'Estacionamento', 'Pedágio', 'Manutenção Veículo', 'Seguro Veículo', 'IPVA/Licenciamento', 'Lavagem Veículo']
    },
    {
        label: 'Saúde',
        options: ['Plano de Saúde', 'Farmácia', 'Consultas', 'Exames', 'Dentista', 'Óculos/Lentes', 'Academia', 'Terapias']
    },
    {
        label: 'Educação',
        options: ['Mensalidade', 'Material Escolar', 'Transporte Escolar', 'Cursos', 'Livros']
    },
    {
        label: 'Lazer & Cultura',
        options: ['Cinema/Teatro', 'Shows/Eventos', 'Viagens', 'Streaming', 'Assinaturas', 'Hobbies']
    },
    {
        label: 'Roupas & Cuidados Pessoais',
        options: ['Roupas/Calçados', 'Lavanderia', 'Salão/Barbearia', 'Cosméticos', 'Higiene Pessoal']
    },
    {
        label: 'Obrigações Financeiras',
        options: ['Impostos', 'Empréstimos', 'Fatura Cartão', 'Previdência Privada', 'Pensão']
    },
    {
        label: 'Despesas Domésticas',
        options: ['Utensílios', 'Eletrodomésticos', 'Móveis/Decoração', 'Produtos de Limpeza']
    },
    {
        label: 'Animais de Estimação',
        options: ['Ração', 'Higiene Pet', 'Veterinário', 'Pet Shop']
    },
    {
        label: 'Diversos',
        options: ['Presentes', 'Doações', 'Taxas Bancárias', 'Multas', 'Eventos Especiais', 'Outros']
    }
];


const formSchema = z.object({
  category: z.string({ required_error: 'Por favor, selecione uma categoria.' }),
  amount: z.coerce.number().positive({ message: 'O valor deve ser positivo.' }),
});

function ExpensesPageContent() {
  const { expenses, addExpense, removeExpense, isClient } = useFinancials();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        amount: undefined,
        category: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addExpense(values);
    toast({
      title: 'Despesa Adicionada!',
      description: `Despesa de ${values.category} adicionada com sucesso.`,
      className: 'border-accent'
    });
    form.reset({amount: undefined, category: undefined});
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
          <CardTitle>Adicionar Nova Despesa</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {expenseCategoryGroups.map(group => (
                            <SelectGroup key={group.label}>
                                <SelectLabel>{group.label}</SelectLabel>
                                {group.options.map(option => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                            </SelectGroup>
                           ))}
                        </SelectContent>
                    </Select>
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
                      <Input type="number" step="0.01" placeholder="150.00" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Adicionar Despesa</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.length > 0 ? (
                  expenses.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell>{formatCurrency(item.amount)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => removeExpense(item.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remover</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">Nenhuma despesa registrada.</TableCell>
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


export default function ExpensesPage() {
    return (
        <PrivateRoute>
            <ExpensesPageContent />
        </PrivateRoute>
    )
}
