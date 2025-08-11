
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useFinancials } from '@/hooks/use-financials';
import { useToast } from '@/hooks/use-toast';
import type { Goal } from '@/types';
import { Edit, Loader2 } from 'lucide-react';

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: 'O valor deve ser positivo.' }),
  type: z.enum(['add', 'withdraw'], { required_error: 'Selecione o tipo de transação.' }),
});

interface GoalContributionDialogProps {
  goal: Goal;
}

export function GoalContributionDialog({ goal }: GoalContributionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateGoalContribution } = useFinancials();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
      type: 'add',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    if (values.type === 'withdraw' && values.amount > goal.currentAmount) {
        form.setError('amount', {
            type: 'manual',
            message: 'Você não pode retirar mais do que o valor atual.',
        });
        setIsLoading(false);
        return;
    }

    try {
        await updateGoalContribution(goal.id, values.amount, values.type);
        toast({
            title: 'Sucesso!',
            description: `Sua contribuição para "${goal.name}" foi registrada.`,
            className: 'border-accent'
        });
        form.reset();
        setOpen(false);
    } catch (error) {
        toast({
            title: 'Erro',
            description: 'Não foi possível registrar a contribuição. Tente novamente.',
            variant: 'destructive'
        });
        console.error(error);
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Edit className="mr-2" />
          Adicionar/Retirar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contribuir para: {goal.name}</DialogTitle>
          <DialogDescription>
            Adicione ou retire um valor da sua meta. Isso atualizará seu progresso.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="50.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Tipo de Transação</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                            >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="add" />
                                </FormControl>
                                <FormLabel className="font-normal">Adicionar</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="withdraw" />
                                </FormControl>
                                <FormLabel className="font-normal">Retirar</FormLabel>
                            </FormItem>
                            </RadioGroup>
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
                    Confirmar
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
