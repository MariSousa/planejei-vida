
'use client';

import { useState, useEffect } from 'react';
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
import { parse, format } from 'date-fns';
import { Loader2, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Debt } from '@/types';

const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  originalAmount: z.coerce.number().positive({ message: 'O valor original deve ser positivo.' }),
  remainingAmount: z.coerce.number().min(0, { message: 'O saldo devedor deve ser 0 ou mais.' }),
  dueDate: z.string().refine((val) => /^\d{2}\/\d{2}\/\d{4}$/.test(val), {
    message: 'Formato de data inválido. Use DD/MM/AAAA.',
  }),
  monthlyPaymentGoal: z.coerce.number().positive({ message: 'O valor da meta mensal deve ser positivo.' }),
  interestRate: z.coerce.number().min(0, { message: 'A taxa de juros não pode ser negativa.' }).optional(),
  totalInstallments: z.coerce.number().int().min(1, { message: 'O valor deve ser pelo menos 1.' }),
  remainingInstallments: z.coerce.number().int().min(0, { message: 'O valor deve ser 0 ou mais.' }),
});


interface EditDebtDialogProps {
  debt: Debt;
}

export function EditDebtDialog({ debt }: EditDebtDialogProps) {
  const [open, setOpen] = useState(false);
  const { updateDebt } = useFinancials();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: debt.name,
        originalAmount: debt.originalAmount,
        remainingAmount: debt.remainingAmount,
        dueDate: format(new Date(debt.dueDate), 'dd/MM/yyyy'),
        monthlyPaymentGoal: debt.monthlyPaymentGoal,
        interestRate: debt.interestRate ?? 0,
        totalInstallments: debt.totalInstallments,
        remainingInstallments: debt.remainingInstallments,
    },
  });

  useEffect(() => {
      if (open) {
          form.reset({
            name: debt.name,
            originalAmount: debt.originalAmount,
            remainingAmount: debt.remainingAmount,
            dueDate: format(new Date(debt.dueDate), 'dd/MM/yyyy'),
            monthlyPaymentGoal: debt.monthlyPaymentGoal,
            interestRate: debt.interestRate ?? 0,
            totalInstallments: debt.totalInstallments,
            remainingInstallments: debt.remainingInstallments,
          });
      }
  }, [debt, form, open]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        const parsedDate = parse(values.dueDate, 'dd/MM/yyyy', new Date());
        const updatedData = {
            ...values,
            dueDate: parsedDate.toISOString(),
        };
        await updateDebt(debt.id, updatedData);
        toast({
            title: 'Compromisso Atualizado!',
            description: `Seu compromisso "${values.name}" foi atualizado.`,
            className: 'border-accent'
        });
        setOpen(false);
    } catch (error) {
        toast({
            title: 'Erro ao atualizar compromisso',
            description: 'Não foi possível salvar as alterações. Tente novamente.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 4) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
    } else if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    form.setValue('dueDate', value);
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Compromisso</DialogTitle>
          <DialogDescription>
            Atualize as informações do seu compromisso financeiro.
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
                name="remainingAmount"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Saldo Devedor Atual (R$)</FormLabel>
                    <FormControl>
                    <Input type="number" step="0.01" placeholder="3500.00" {...field} value={field.value ?? ''} />
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
                           <Input placeholder="DD/MM/AAAA" {...field} onChange={handleDateChange} />
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
                    Salvar Alterações
                </Button>
            </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
