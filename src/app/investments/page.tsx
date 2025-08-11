
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { PiggyBank, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PrivateRoute } from '@/components/private-route';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EditInvestmentDialog } from '@/components/edit-investment-dialog';

const formSchema = z.object({
  type: z.string({ required_error: 'Por favor, selecione o tipo.' }),
  customType: z.string().optional(),
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  institution: z.string().min(2, { message: 'A instituição deve ter pelo menos 2 caracteres.' }),
  amount: z.coerce.number().positive({ message: 'O valor deve ser positivo.' }),
  yieldRate: z.coerce.number().min(0, { message: 'O rendimento não pode ser negativo.' }),
}).refine(data => {
    if (data.type === 'Outro') {
        return data.customType && data.customType.length >= 2;
    }
    return true;
}, {
    message: 'O nome do tipo deve ter pelo menos 2 caracteres.',
    path: ['customType'],
});

function InvestmentsPageContent() {
  const { investments, addInvestment, isClient } = useFinancials();
  const { toast } = useToast();
  const [showCustomType, setShowCustomType] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: undefined,
      customType: '',
      name: '',
      institution: '',
      amount: undefined,
      yieldRate: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const investmentData = {
        ...values,
        type: values.type === 'Outro' ? values.customType! : values.type,
    };
    
    // Remove customType from the data to be saved
    const { customType, ...dataToSave } = investmentData;

    addInvestment(dataToSave);
    toast({
      title: 'Investimento Adicionado!',
      description: `Seu investimento em ${dataToSave.type} foi adicionado.`,
      className: 'border-accent'
    });
    form.reset({
      type: undefined,
      customType: '',
      name: '',
      institution: '',
      amount: undefined,
      yieldRate: undefined,
    });
    setShowCustomType(false);
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const totalInvested = investments.reduce((acc, item) => acc + item.amount, 0);

  const handleTypeChange = (value: string) => {
      form.setValue('type', value);
      if (value === 'Outro') {
          setShowCustomType(true);
      } else {
          setShowCustomType(false);
          form.setValue('customType', '');
      }
  }

  if (!isClient) {
    return (
      <div className="flex flex-col gap-8">
        <Skeleton className="h-[480px]" />
        <Skeleton className="h-[250px]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-8 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Investimento</CardTitle>
            <CardDescription>Cadastre seus ativos para acompanhar seus rendimentos.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Investimento</FormLabel>
                      <Select onValueChange={handleTypeChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Poupança">Poupança</SelectItem>
                          <SelectItem value="Renda Fixa">Renda Fixa</SelectItem>
                          <SelectItem value="CDB">CDB</SelectItem>
                          <SelectItem value="LCI">LCI</SelectItem>
                          <SelectItem value="LCA">LCA</SelectItem>
                          <SelectItem value="Tesouro Selic">Tesouro Selic</SelectItem>
                          <SelectItem value="Outro">Outro...</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {showCustomType && (
                     <FormField
                        control={form.control}
                        name="customType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome do Tipo</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Fundo Imobiliário" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Investimento</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: CDB Banco Y 2028" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instituição Financeira</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Meu Banco" {...field} />
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
                      <FormLabel>Valor Investido (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="1000.00" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="yieldRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rendimento (% CDI ao ano)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="110" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="md:col-span-full">Adicionar Investimento</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Minha Carteira de Investimentos</CardTitle>
            <CardDescription>Resumo dos seus ativos cadastrados.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Instituição</TableHead>
                    <TableHead>Rendimento</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="w-[100px] text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investments.length > 0 ? (
                    investments.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.type}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.institution}</TableCell>
                        <TableCell>{item.yieldRate}% CDI</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(item.amount)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <EditInvestmentDialog investment={item} />
                            <Button variant="ghost" size="icon" onClick={() => removeInvestment(item.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remover</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <PiggyBank className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        Nenhum investimento registrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                 {investments.length > 0 && (
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={5} className="font-bold text-lg">Total Investido</TableCell>
                            <TableCell colSpan={1} className="text-right font-bold text-lg">{formatCurrency(totalInvested)}</TableCell>
                        </TableRow>
                    </TableFooter>
                 )}
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function InvestmentsPage() {
    return (
        <PrivateRoute>
            <InvestmentsPageContent />
        </PrivateRoute>
    )
}
