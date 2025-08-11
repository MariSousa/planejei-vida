
'use client';

import { useState } from 'react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Loader2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  originalAmount: z.coerce.number().positive({ message: 'O valor original deve ser positivo.' }),
  remainingAmount: z.coerce.number().positive({ message: 'O saldo devedor deve ser positivo.' }),
  dueDate: z.date({ required_error: 'A data de vencimento é obrigatória.'}),
  monthlyPaymentGoal: z.coerce.number().positive({ message: 'O valor da meta mensal deve ser positivo.' }),
  interestRate: z.coerce.number().min(0, { message: 'A taxa de juros não pode ser negativa.' }).optional(),
  totalInstallments: z.coerce.number().int().min(0, { message: 'O valor deve ser 0 ou mais.' }),
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
      remainingAmount: undefined,
      dueDate: undefined,
      monthlyPaymentGoal: undefined,
      interestRate: undefined,
      totalInstallments: undefined,
      remainingInstallments: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        const newDebt = {
            ...values,
            dueDate: values.dueDate.toISOString(),
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
                    <FormItem className="flex flex-col">
                        <FormLabel>Data de Vencimento Final</FormLabel>
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
                    <Input type="number" step="0.01" placeholder="8.5" {...field} value={field.value ?? ''} />
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
                    <Input type="number" placeholder="24" {...field} value={field.value ?? ''} />
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
                    <Input type="number" placeholder="12" {...field} value={field.value ?? ''} />
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
