
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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PrivateRoute } from '@/components/private-route';
import { CreateCategoryDialog } from '@/components/create-category-dialog';
import { CategorySelector } from '@/components/category-selector';
import { getIconForCategory } from '@/lib/categories';
import { PlannedItemSuggestion } from '@/components/planned-item-suggestion';
import { CurrencyInput } from '@/components/currency-input';


const formSchema = z.object({
  category: z.string({ required_error: 'Por favor, selecione uma categoria.' }),
  amount: z.coerce.number().int().positive({ message: 'O valor deve ser positivo.' }),
});

function ExpensesPageContent() {
  const { expenses, addExpense, removeExpense, isClient, customCategories, favoriteCategories, addFavorite, removeFavorite, removeCategory, totals, pendingPlannedExpenses, pendingDebtPayments, payDownDebt } = useFinancials();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        amount: undefined,
        category: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addExpense({ category: values.category, amount: values.amount / 100 });
    toast({
      title: 'Despesa Adicionada!',
      description: `Despesa de ${values.category} adicionada com sucesso.`,
      className: 'border-accent'
    });
    form.reset({amount: undefined, category: undefined});
    setSelectedCategory(undefined);
  }

  const handleFavoriteToggle = async (category: string, isCurrentlyFavorite: boolean) => {
    try {
      if (isCurrentlyFavorite) {
        await removeFavorite(category);
        toast({
          description: `"${category}" removido dos favoritos.`,
        });
      } else {
        await addFavorite(category);
        toast({
          description: `"${category}" adicionado aos favoritos.`,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível atualizar os favoritos.',
      });
    }
  };

  const handleRemoveCategory = async (categoryId: string) => {
      try {
          await removeCategory(categoryId);
          toast({
              description: "Categoria personalizada removida."
          });
      } catch (error) {
           toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Não foi possível remover a categoria.',
            });
      }
  }

  const handleCategorySelect = (category: string) => {
      setSelectedCategory(category);
      form.setValue('category', category, { shouldValidate: true });
  }

  const handleAddPlannedExpense = async (name: string, amount: number) => {
      // For expenses, we need to find a suitable category.
      // For simplicity, we'll use the name as a custom category if it doesn't match.
      // A more complex implementation could ask the user.
      addExpense({ category: name, amount });
       toast({
            title: 'Gasto Planejado Adicionado!',
            description: `Gasto de ${name} adicionado com sucesso.`,
            className: 'border-accent'
        });
  }

   const handlePayDebt = async (debtId: string, name: string, amount: number) => {
        try {
            await payDownDebt(debtId, amount, name);
            toast({
                title: 'Pagamento de Compromisso Realizado!',
                description: `O valor foi deduzido de "${name}" e adicionado como um gasto.`,
                className: 'border-accent',
            });
        } catch (error) {
             toast({
                title: 'Erro ao processar pagamento',
                description: String(error),
                variant: 'destructive',
            });
        }
    };
  
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
    <div className="flex flex-col gap-6">
         {(pendingPlannedExpenses.length > 0 || pendingDebtPayments.length > 0) && (
            <Card>
                <CardHeader>
                    <CardTitle>Lançamentos Sugeridos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {pendingDebtPayments.map(debt => (
                         <PlannedItemSuggestion
                            key={debt.id}
                            item={{
                                id: debt.id,
                                name: debt.name,
                                amount: debt.monthlyPaymentGoal,
                            }}
                            onAdd={() => handlePayDebt(debt.id, debt.name, debt.monthlyPaymentGoal)}
                            suggestionType="debt"
                        />
                    ))}
                    {pendingPlannedExpenses.map(item => (
                        <PlannedItemSuggestion
                            key={item.id}
                            item={item}
                            onAdd={() => handleAddPlannedExpense(item.name, item.amount)}
                            suggestionType="plan"
                        />
                    ))}
                </CardContent>
            </Card>
        )}
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        <Card>
            <CardHeader>
            <CardTitle>Adicionar Nova Despesa</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Categoria</label>
                        <CreateCategoryDialog />
                        </div>
                        <CategorySelector
                            customCategories={customCategories}
                            favoriteCategories={favoriteCategories}
                            onSelect={handleCategorySelect}
                            onFavoriteToggle={handleFavoriteToggle}
                            onRemoveCategory={handleRemoveCategory}
                            selectedValue={selectedCategory}
                        />
                        {/* Display validation message for category manually */}
                        {form.formState.errors.category && <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.category.message}</p>}
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Valor</FormLabel>
                                    <FormControl>
                                    <CurrencyInput
                                        placeholder="R$ 150,00"
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit">Adicionar Despesa</Button>
                        </form>
                    </Form>
                </div>
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
                    expenses.map((item) => {
                        const Icon = getIconForCategory(item.category);
                        return (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            {item.category}
                            </TableCell>
                            <TableCell>{formatCurrency(item.amount)}</TableCell>
                            <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => removeExpense(item.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remover</span>
                            </Button>
                            </TableCell>
                        </TableRow>
                        )
                    })
                    ) : (
                    <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">Nenhuma despesa registrada.</TableCell>
                    </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={1} className="font-bold">Total</TableCell>
                        <TableCell colSpan={2} className="text-right font-bold">{formatCurrency(totals.totalExpenses)}</TableCell>
                    </TableRow>
                </TableFooter>
                </Table>
            </div>
            </CardContent>
        </Card>
        </div>
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
