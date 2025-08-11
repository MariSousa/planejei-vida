
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
import { EditInvestmentDialog } from '@/components/edit-investment-dialog';
import { InvestmentSelector } from '@/components/investment-selector';
import { InstitutionSelector } from '@/components/institution-selector';


const formSchema = z.object({
  type: z.string({ required_error: 'Por favor, selecione o tipo.' }),
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  institution: z.string({ required_error: 'Por favor, selecione a instituição.' }),
  amount: z.coerce.number().positive({ message: 'O valor deve ser positivo.' }),
  yieldRate: z.coerce.number().min(0, { message: 'O rendimento não pode ser negativo.' }),
});

function InvestmentsPageContent() {
  const { investments, addInvestment, removeInvestment, isClient } = useFinancials();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [selectedInstitution, setSelectedInstitution] = useState<string | undefined>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: undefined,
      name: '',
      institution: undefined,
      amount: undefined,
      yieldRate: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addInvestment(values);
    toast({
      title: 'Investimento Adicionado!',
      description: `Seu investimento em ${values.type} foi adicionado.`,
      className: 'border-accent'
    });
    form.reset({
      type: undefined,
      name: '',
      institution: undefined,
      amount: undefined,
      yieldRate: undefined,
    });
    setSelectedType(undefined);
    setSelectedInstitution(undefined);
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const totalInvested = investments.reduce((acc, item) => acc + item.amount, 0);

  const handleTypeSelect = (type: string) => {
      setSelectedType(type);
      form.setValue('type', type, { shouldValidate: true });
  }

  const handleInstitutionSelect = (institution: string) => {
    setSelectedInstitution(institution);
    form.setValue('institution', institution, { shouldValidate: true });
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-6">
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
                    <div className="grid grid-cols-2 gap-4">
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
                            <FormLabel>Rendimento (% CDI / ano)</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.1" placeholder="110" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                     <div className="space-y-2">
                         <FormLabel>Instituição Financeira</FormLabel>
                        <InstitutionSelector onSelect={handleInstitutionSelect} selectedValue={selectedInstitution} />
                         {form.formState.errors.institution && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.institution.message}</p>}
                     </div>
                     <div className="space-y-2">
                         <FormLabel>Tipo de Investimento</FormLabel>
                        <InvestmentSelector onSelect={handleTypeSelect} selectedValue={selectedType} />
                         {form.formState.errors.type && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.type.message}</p>}
                     </div>
                </div>
                <Button type="submit" className="w-full">Adicionar Investimento</Button>
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
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
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
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.institution}</TableCell>
                        <TableCell>{item.yieldRate}% CDI / ano</TableCell>
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
