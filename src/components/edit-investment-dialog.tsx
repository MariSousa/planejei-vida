'use client';

import { useState } from 'react';
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
import { useFinancials } from '@/hooks/use-financials';
import { useToast } from '@/hooks/use-toast';
import type { Investment } from '@/types';
import { Loader2, Pencil } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  type: z.string({ required_error: 'Por favor, selecione o tipo.' }),
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  institution: z.string().min(2, { message: 'A instituição deve ter pelo menos 2 caracteres.' }),
  amount: z.coerce.number().positive({ message: 'O valor deve ser positivo.' }),
  yieldRate: z.coerce.number().positive({ message: 'O rendimento deve ser um número positivo.' }),
});

interface EditInvestmentDialogProps {
  investment: Investment;
}

export function EditInvestmentDialog({ investment }: EditInvestmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateInvestment } = useFinancials();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: investment.type,
      name: investment.name,
      institution: investment.institution,
      amount: investment.amount,
      yieldRate: investment.yieldRate,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
        await updateInvestment(investment.id, values);
        toast({
            title: 'Investimento Atualizado!',
            description: `Seu investimento em ${values.type} foi atualizado com sucesso.`,
            className: 'border-accent'
        });
        setOpen(false);
    } catch (error) {
        toast({
            title: 'Erro',
            description: 'Não foi possível atualizar o investimento.',
            variant: 'destructive'
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Editar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Investimento</DialogTitle>
          <DialogDescription>
            Atualize as informações do seu investimento.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Tipo de Investimento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo..." />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Renda Fixa">Renda Fixa</SelectItem>
                        <SelectItem value="CDB">CDB</SelectItem>
                        <SelectItem value="LCI">LCI</SelectItem>
                        <SelectItem value="LCA">LCA</SelectItem>
                        <SelectItem value="Tesouro Selic">Tesouro Selic</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
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
                    <Input type="number" step="0.01" placeholder="1000.00" {...field} />
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
                    <FormLabel>Rendimento (% do CDI)</FormLabel>
                    <FormControl>
                    <Input type="number" step="0.1" placeholder="110" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <DialogFooter>
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
