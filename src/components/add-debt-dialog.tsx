
'use client';

import React, { useState } from 'react';
import { useFinancials } from '@/hooks/use-financials';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { parse } from 'date-fns';
import { Loader2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  originalAmount: z.coerce.number().positive({ message: 'O valor original deve ser positivo.' }),
  paidAmount: z.coerce.number().min(0, { message: 'O valor pago não pode ser negativo.' }),
  startDate: z.string().refine((val) => /^\d{2}\/\d{2}\/\d{4}$/.test(val), {
    message: 'Data de início é obrigatória. Use DD/MM/AAAA.',
  }),
  dueDate: z.string().refine((val) => /^\d{2}\/\d{2}\/\d{4}$/.test(val), {
    message: 'Formato de data inválido. Use DD/MM/AAAA.',
  }),
  monthlyPaymentGoal: z.coerce.number().positive({ message: 'O valor da meta mensal deve ser positivo.' }),
  interestRate: z.coerce.number().min(0, { message: 'A taxa de juros não pode ser negativa.' }).optional(),
  totalInstallments: z.coerce.number().int().min(1, { message: 'O valor deve ser pelo menos 1.' }),
  remainingInstallments: z.coerce.number().int().min(0, { message: 'O valor deve ser 0 ou mais.' }),
});

export function AddDebtDialog() {
  const [open, setOpen] = useState(false);
  const { addDebt } = useFinancials();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      originalAmount: undefined,
      paidAmount: 0,
      startDate: undefined,
      dueDate: undefined,
      monthlyPaymentGoal: undefined,
      interestRate: 0,
      totalInstallments: 1,
      remainingInstallments: 1,
    },
  });

  const watchTotalInstallments = form.watch('totalInstallments');
    React.useEffect(() => {
        form.setValue('remainingInstallments', watchTotalInstallments);
    }, [watchTotalInstallments, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        const parsedStartDate = parse(values.startDate, 'dd/MM/yyyy', new Date());
        const parsedDueDate = parse(values.dueDate, 'dd/MM/yyyy', new Date());

        if (isNaN(parsedStartDate.getTime())) {
            form.setError('startDate', { type: 'manual', message: 'Data de início inválida.' });
            setIsLoading(false);
            return;
        }

        const newDebt = {
            name: values.name,
            originalAmount: values.originalAmount,
            remainingAmount: values.originalAmount - values.paidAmount,
            startDate: parsedStartDate.toISOString(),
            dueDate: parsedDueDate.toISOString(),
            monthlyPaymentGoal: values.monthlyPaymentGoal,
            interestRate: values.interestRate,
            totalInstallments: values.totalInstallments,
            remainingInstallments: values.remainingInstallments,
            status: 'Pendente' as const,
            lastPaymentDate: null,
        };
        await addDebt(newDebt);
        toast({
        title: 'Compromisso Adicionado!',
        description: `Seu compromisso "${values.name}" foi adicionado.`,
        className: 'border-accent'
        });
        form.reset();
        setOpen(false);
    } catch (error) {
        toast({
            title: 'Erro ao adicionar compromisso',
            description: 'Não foi possível salvar o compromisso. Tente novamente.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'dueDate' | 'startDate') => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 4) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
    } else if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    form.setValue(fieldName, value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Compromisso
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Compromisso</DialogTitle>
          <DialogDescription>
            Cadastre dívidas, financiamentos ou saldos de cartão de crédito que você deseja quitar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem className="md:col-span-2">
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
                name="originalAmount"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Valor Original (R$)</FormLabel>
                    <FormControl>
                    <Input type="number" step="0.01" placeholder="5000.00" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="paidAmount"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Quanto você já pagou? (R$)</FormLabel>
                    <FormControl>
                    <Input type="number" step="0.01" placeholder="1500.00" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Data de Início</FormLabel>
                        <FormControl>
                           <Input placeholder="DD/MM/AAAA" {...field} onChange={(e) => handleDateChange(e, 'startDate')} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Data de Vencimento Final</FormLabel>
                        <FormControl>
                           <Input placeholder="DD/MM/AAAA" {...field} onChange={(e) => handleDateChange(e, 'dueDate')} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="monthlyPaymentGoal"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Valor da Parcela Mensal (R$)</FormLabel>
                    <FormControl>
                    <Input type="number" step="0.01" placeholder="200.00" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Taxa de Juros (% a.m.) (Opcional)</FormLabel>
                    <FormControl>
                    <Input type="number" step="0.01" placeholder="0" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="totalInstallments"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Nº Total de Parcelas</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="1" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="remainingInstallments"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Nº de Parcelas Restantes</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="1" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <DialogFooter className="md:col-span-2">
                <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancelar</Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Adicionar Compromisso
                </Button>
            </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
