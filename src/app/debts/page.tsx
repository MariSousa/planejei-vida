
'use client';

import { useState } from 'react';
import { useFinancials } from '@/hooks/use-financials';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PrivateRoute } from '@/components/private-route';
import { format, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { Debt } from '@/types';
import { AddDebtDialog } from '@/components/add-debt-dialog';
import { EditDebtDialog } from '@/components/edit-debt-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

function DebtsPageContent() {
  const { debts, removeDebt, payInstallment, isClient } = useFinancials();
  const { toast } = useToast();

  const handleInstallmentPay = async (debt: Debt) => {
    try {
      await payInstallment(debt.id, debt.monthlyPaymentGoal);
      toast({
        title: 'Parcela Paga!',
        description: `Uma parcela de "${debt.name}" foi registrada como paga.`,
        className: 'border-accent',
      });
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Erro',
            description: 'Não foi possível registrar o pagamento da parcela.',
        });
    }
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getInstallmentDate = (debt: Debt, installmentIndex: number) => {
    if (!debt.dueDate) return '';
    const finalDate = new Date(debt.dueDate);
    const totalInstallments = debt.totalInstallments || 1;
    const remainingInstallments = debt.remainingInstallments || 0;
    
    const paidInstallments = totalInstallments - remainingInstallments;
    const currentInstallmentNumber = paidInstallments + installmentIndex + 1;

    // This logic calculates the date of a future installment by going back from the final due date
    const monthsToGoBack = totalInstallments - currentInstallmentNumber;
    const installmentDate = addMonths(finalDate, -monthsToGoBack);
    
    return format(installmentDate, "MMMM, yyyy", { locale: ptBR });
  };


  const totalDebts = debts.filter(d => d.status === 'Pendente').reduce((acc, debt) => acc + debt.remainingAmount, 0);

  if (!isClient) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-[150px]" />
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[200px]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center">
             <h1 className="text-2xl font-bold font-headline">Compromissos Financeiros</h1>
             <AddDebtDialog />
        </div>
     
      <Card>
        <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
            <CardDescription>O valor total dos seus compromissos pendentes.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(totalDebts)}</p>
        </CardContent>
      </Card>
      
      <div className="flex flex-col gap-4">
        {debts.length > 0 ? (
            debts.map((item) => {
                const remaining = item.remainingInstallments ?? 0;
                const installmentsToShow = Array.from({ length: Math.min(remaining, 3) });
                const hasMoreInstallments = remaining > 3;

                return (
                    <Card key={item.id} className={cn('transition-all', item.status === 'Pago' && 'bg-muted/50')}>
                        <CardHeader className="flex-row items-start justify-between pb-4">
                            <div className="space-y-1">
                                <CardTitle className={cn("text-lg", item.status === 'Pago' && 'line-through')}>{item.name}</CardTitle>
                                <CardDescription>{item.remainingInstallments} de {item.totalInstallments} parcelas restantes</CardDescription>
                            </div>
                            <div className="text-right">
                                <p className={cn("font-bold text-lg", item.status === 'Pago' && 'line-through')}>{formatCurrency(item.remainingAmount)}</p>
                                <p className="text-xs text-muted-foreground">de {formatCurrency(item.originalAmount)}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           {item.status === 'Pendente' && installmentsToShow.length > 0 && (
                                <div className="space-y-3 p-3 border rounded-md bg-background/50">
                                    <h4 className="text-sm font-semibold">Próximos Pagamentos:</h4>
                                    {installmentsToShow.map((_, index) => {
                                        const installmentId = `${item.id}-installment-${index}`;
                                        return (
                                            <div key={installmentId} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id={installmentId} onCheckedChange={() => handleInstallmentPay(item)} />
                                                    <Label htmlFor={installmentId} className="capitalize text-sm">
                                                        Parcela {getInstallmentDate(item, index)}
                                                    </Label>
                                                </div>
                                                <span className="font-medium text-sm">{formatCurrency(item.monthlyPaymentGoal)}</span>
                                            </div>
                                        )
                                    })}
                                    {hasMoreInstallments && (
                                        <p className="text-xs text-muted-foreground text-center pt-2">... e mais {remaining - 3} parcelas.</p>
                                    )}
                                </div>
                            )}
                            {item.status === 'Pago' && (
                                <p className="text-sm font-medium text-green-600 text-center p-4 bg-green-50 rounded-md">Compromisso quitado!</p>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                             <EditDebtDialog debt={item} />
                            <Button variant="ghost" size="icon" onClick={() => removeDebt(item.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remover</span>
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })
        ) : (
            <div className="flex h-[150px] w-full items-center justify-center rounded-lg border-2 border-dashed">
                <p className="text-center text-muted-foreground">Nenhum compromisso registrado.</p>
            </div>
        )}
      </div>
    </div>
  );
}

export default function DebtsPage() {
    return (
        <PrivateRoute>
            <DebtsPageContent />
        </PrivateRoute>
    )
}
