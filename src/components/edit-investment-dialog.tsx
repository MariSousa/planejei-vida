
'use client';

import { useState, useEffect } from 'react';
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
import { InvestmentSelector } from './investment-selector';
import { InstitutionSelector } from './institution-selector';


const formSchema = z.object({
  type: z.string({ required_error: 'Por favor, selecione o tipo.' }),
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  institution: z.string({ required_error: 'Por favor, selecione a instituição.' }),
  amount: z.coerce.number().positive({ message: 'O valor deve ser positivo.' }),
  yieldRate: z.coerce.number().min(0, { message: 'O rendimento não pode ser negativo.' }),
});

interface EditInvestmentDialogProps {
  investment: Investment;
}

export function EditInvestmentDialog({ investment }: EditInvestmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateInvestment } = useFinancials();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string | undefined>(investment.type);
  const [selectedInstitution, setSelectedInstitution] = useState<string | undefined>(investment.institution);

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

  useEffect(() => {
    if (open) {
        form.reset({
            type: investment.type,
            name: investment.name,
            institution: investment.institution,
            amount: investment.amount,
            yieldRate: investment.yieldRate,
        });
        setSelectedType(investment.type);
        setSelectedInstitution(investment.institution);
    }
  }, [investment, form, open]);


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

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    form.setValue('type', type, { shouldValidate: true });
  }
  
  const handleInstitutionSelect = (institution: string) => {
    setSelectedInstitution(institution);
    form.setValue('institution', institution, { shouldValidate: true });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Editar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Editar Investimento</DialogTitle>
          <DialogDescription>
            Atualize as informações do seu investimento.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
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
                    <div className="space-y-2">
                            <FormLabel>Instituição Financeira</FormLabel>
                        <InstitutionSelector onSelect={handleInstitutionSelect} selectedValue={selectedInstitution} />
                            {form.formState.errors.institution && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.institution.message}</p>}
                        </div>
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
                            <FormLabel>Rendimento (% CDI)</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.1" placeholder="110" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                </div>
                <div>
                        <div className="space-y-2">
                            <FormLabel>Tipo de Investimento</FormLabel>
                        <InvestmentSelector onSelect={handleTypeSelect} selectedValue={selectedType} />
                            {form.formState.errors.type && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.type.message}</p>}
                        </div>
                </div>
            </div>
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
